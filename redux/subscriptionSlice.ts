import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionState {
    isPremium: boolean;
}

const initialState: SubscriptionState = {
    isPremium: false,
};

export const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        setPremium: (state, action: PayloadAction<boolean>) => {
        state.isPremium = action.payload;
        },
    },
});

export const { setPremium } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
