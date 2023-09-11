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
      message: 'Missing customer email or org data.'
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

    console.log(customer);

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