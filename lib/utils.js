const jwt = require('jsonwebtoken');
const stripe = require('../stripe');
const { commonQueries } = require('../database');

function createJWT(userObject) {
  return jwt.sign(
    {
      user: userObject
    },
    process.env.SECRET_KEY,
    { expiresIn: 36000 }
  );
}

async function updateStripeSubscription(con, userId, orgId) {
  const [customerIdResult] = await con.query('SELECT stripe_customerId FROM users WHERE id = ?', [userId]);
  const customerId = customerIdResult[0].stripe_customerId;

  if (!customerId) {
    return { message: 'No customerId was found.' };
  }

  const subscriptions = (await stripe.subscriptions.list({
    customer: customerId
  })).data;

  const activeSubscription = subscriptions.find(sub => sub.status === 'active');
  const pastDueSubscription = subscriptions.find(sub => sub.status === 'past_due');

  if (!activeSubscription) {
    if (pastDueSubscription) {
      return { message: 'Your subscription is past due.  Please update your subscription from account settings and try again.' };
    } else {
      return { message: 'No active subscription was found.  You can manage/create a subscription from account settings.' };
    }
  }

  const orgAdminCount = await commonQueries.getOrgAdminCount(con, orgId);

  await stripe.subscriptions.update(
    activeSubscription.id,
    {
      proration_behavior: 'none',
      items: [
        {
          id: activeSubscription.items.data[0].id,
          quantity: orgAdminCount
        },
      ],
    }
  );

  return { success: true };
}

module.exports = {
  createJWT,
  updateStripeSubscription
};