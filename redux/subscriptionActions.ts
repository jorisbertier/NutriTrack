import Purchases from 'react-native-purchases';
import { AppDispatch } from './store';
import { setPremium } from './subscriptionSlice';

export const fetchSubscriptionStatus = () => async (dispatch: AppDispatch) => {
    try {
        const customerInfo = await Purchases.getCustomerInfo();
        const entitlements = customerInfo.entitlements.active;

        const isSubscribed = entitlements && Object.keys(entitlements).length > 0;
        dispatch(setPremium(isSubscribed));
    } catch (error) {
        console.log('Erreur récupération subscription', error);
        dispatch(setPremium(false));
    }
};
