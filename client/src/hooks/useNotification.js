import { useEffect } from "react";

export default function useNotification({ user, openModal, isOrgOwner }) {

  useEffect(() => {
    if (user && isOrgOwner) {
      checkSubscription(user, openModal);
    }
  }, [user, isOrgOwner]);

  return null;
};

const checkSubscription = (user, openModal) => {
  const supressedPastDue = sessionStorage.getItem('supressPastDue');

  if (!supressedPastDue && user.subscriptionStatus === 'past_due') {
    openModal('subscription-past-due');
  }
};