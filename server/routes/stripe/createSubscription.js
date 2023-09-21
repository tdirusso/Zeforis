const stripe = require('../../../stripe');
const { pool } = require('../../../database');
const { stripeSubscriptionPriceId } = require('../../../config');

module.exports = async (req, res, next) => {

  const {
    numAdmins
  } = req.body;

  const {
    ownedOrg,
    userObject
  } = req;

  if (!userObject || !ownedOrg) {
    return res.json({
      message: 'Missing user or org data.'
    });
  }

  if (userObject.plan !== 'free') {
    return res.json({
      message: 'You are already on a paid Zeforis plan.  Please update the subscription instead.'
    });
  }

  if (!numAdmins || typeof numAdmins !== 'number' || numAdmins <= 0 || numAdmins >= 10000) {
    return res.json({
      message: 'Number of administrators is invalid.'
    });
  }

  try {


    const [orgAdminsCount] = await pool.query(
      ` 
        SELECT COUNT(DISTINCT users.id) AS adminCount
        FROM engagement_users
        LEFT JOIN engagements ON engagement_users.engagement_id = engagements.id
        LEFT JOIN users ON engagement_users.user_id = users.id
        LEFT JOIN orgs ON orgs.id = engagements.org_id
        WHERE engagements.org_id = ? AND role = 'admin' AND users.id != ?
      `,
      [ownedOrg.id, userObject.id]
    );

    if (numAdmins <= orgAdminsCount[0].adminCount) {
      return res.json({
        message: `Number of admins must be >= ${orgAdminsCount.adminCount}.  Received ${numAdmins}.`
      });
    }

    let customer = null;

    const customers = await stripe.customers.list({
      email: userObject.email,
      limit: 1
    });

    if (customers.data.length) {
      customer = customers.data[0];
    } else {
      const newCustomer = await stripe.customers.create({
        email: userObject.email,
        name: `${userObject.firstName} ${userObject.lastName}`,
        metadata: {
          'Zeforis User ID': userObject.id,
          'Organization ID': ownedOrg.id,
          'Organization Name': ownedOrg.name
        }
      });

      await pool.query('UPDATE users SET stripe_customerId = ? WHERE id = ?', [newCustomer.id, userObject.id]);

      customer = newCustomer;
    }

    const existingSubscriptions = (await stripe.subscriptions.list({
      customer: customer.id,
      limit: 100,
      expand: ['data.latest_invoice.payment_intent']
    })).data;

    if (existingSubscriptions.length) {
      for (const existingSubscription of existingSubscriptions) {
        if (existingSubscription.status === 'incomplete') {
          return res.json({
            clientSecret: existingSubscription.latest_invoice.payment_intent.client_secret
          });
        }
      }

      return res.json({ hasSubscription: true });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: stripeSubscriptionPriceId,
        quantity: numAdmins
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    });

    return res.json({
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    next(error);
  }
};