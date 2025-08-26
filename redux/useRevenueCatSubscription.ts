import { useEffect } from "react";
import Purchases, { CustomerInfo } from "react-native-purchases";
import { useDispatch } from "react-redux";
import { setPremium } from "./subscriptionSlice";

export const useRevenueCatSubscription = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkCustomerInfo = async () => {
      try {
        const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
        const isPremium = Object.keys(customerInfo.entitlements.active).length > 0;
        dispatch(setPremium(isPremium));
      } catch (e) {
        console.log("Erreur récupération RevenueCat", e);
      }
    };

    checkCustomerInfo();

    // Listener pour mises à jour en live
    const listener = Purchases.addCustomerInfoUpdateListener(
      (customerInfo: CustomerInfo) => {
        const isPremium = Object.keys(customerInfo.entitlements.active).length > 0;
        dispatch(setPremium(isPremium));
      }
    );

    return () => listener.remove();
  }, [dispatch]);
};
