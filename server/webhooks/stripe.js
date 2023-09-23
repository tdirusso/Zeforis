const { pool } = require('../../database');
const stripe = require('../../stripe');
const slackbot = require('../../slackbot');
const cache = require('../../cache');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

module.exports = async (req, res, next) => {

  let event = req.body;

  const signature = req.headers['stripe-signature'];

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.log(`⚠️  Webhook signature verification failed.`, error.message);
    return res.sendStatus(400);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.deleted': {
        const { customer, plan, quantity } = event.data.object;

        if (customer) {
          const [userResult] = await pool.query(
            'SELECT id, email FROM users WHERE stripe_customerId = ?',
            [customer]
          );

          const user = userResult[0];

          if (user) {
            await pool.query('UPDATE users SET stripe_subscription_status = "canceled", plan = "free" WHERE id = ?', [user.id]);

            const [ownedOrgs] = await pool.query('SELECT id FROM orgs WHERE owner_id = ?', [user.id]);

            ownedOrgs.forEach(({ id }) => {
              let cachedOrgData = cache.get(`org-${id}`);
              cache.set(`org-${id}`, { ...cachedOrgData, ownerPlan: 'free' });
            });

            await slackbot.post({
              channel: slackbot.channels.events,
              message: `*Subscription Canceled* 😢\n*Amount:*  -${((plan.amount * quantity) / 100).toLocaleString('en', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}\n*Email:*  ${user.email}`
            });
          }
        }
        break;
      }
      case 'customer.subscription.updated': {
        const { customer, status } = event.data.object;

        if (status === 'past_due' && customer) {
          const [userResult] = await pool.query(
            'SELECT id, email FROM users WHERE stripe_customerId = ?',
            [customer]
          );

          const user = userResult[0];

          if (user) {
            await pool.query('UPDATE users SET stripe_subscription_status = "past_due" WHERE id = ?', [user.id]);

            await slackbot.post({
              channel: slackbot.channels.events,
              message: `*Subscription Past Due* 😧\n*Email:*  ${user.email}`
            });
          }
        }
        break;
      }
      case 'invoice.paid':
        {
          const { customer, amount_paid } = event.data.object;

          if (customer) {
            const [userResult] = await pool.query(
              'SELECT id, email FROM users WHERE stripe_customerId = ?',
              [customer]
            );

            const user = userResult[0];

            if (user) {
              await pool.query('UPDATE users SET stripe_subscription_status = "active", plan = "pro" WHERE id = ?', [user.id]);

              const [ownedOrgs] = await pool.query('SELECT id FROM orgs WHERE owner_id = ?', [user.id]);

              ownedOrgs.forEach(({ id }) => {
                let cachedOrgData = cache.get(`org-${id}`);
                cache.set(`org-${id}`, { ...cachedOrgData, ownerPlan: 'pro' });
              });

              await slackbot.post({
                channel: slackbot.channels.events,
                message: `*New Subscription Payment* 🤑\n*Amount:*  ${(amount_paid / 100).toLocaleString('en', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}\n*Email:*  ${user.email}`
              });
            }
          }
          break;
        }
      default:
        break;
    }

    return res.send();
  } catch (error) {
    next(error);
    return res.sendStatus(400);
  }
};
