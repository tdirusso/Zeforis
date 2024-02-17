import { User } from "@shared/types/User";
import { useEffect } from "react";

export default function useNotification({ user, openModal, isOrgOwner }: { user: User | null, openModal: (modalType: string, props: any) => void, isOrgOwner: boolean; }) {

  useEffect(() => {
    if (user && isOrgOwner) {
      checkSubscription(user, openModal);
    }
  }, [user, isOrgOwner]);

  return null;
};

const checkSubscription = (user: User, openModal: (modalType: string, props?: any) => void) => {
  const supressedPastDue = sessionStorage.getItem('supressPastDue');

  if (!supressedPastDue && user.subscriptionStatus === 'past_due') {
    openModal('subscription-past-due');
  }
};