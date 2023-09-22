import { useEffect } from "react";

export default function useOnloadNotification({ user, openModal }) {

  useEffect(() => {
    console.log(openModal)
    openModal('search')
    if (user) {
      const checkSubscription = async () => {
        try {
          // if (isPastDue) {
          //   openModal("subscriptionPastDueModal"); 
          // }
        } catch (error) {
          console.error("Error checking subscription status:", error);
        }
      };

      checkSubscription();
    }
  }, [user]);

  return null;
};