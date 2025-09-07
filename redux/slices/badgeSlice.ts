import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BadgesState {
    unlocked: string[];
}

const initialState: BadgesState = {
    unlocked: [],
};

const badgesSlice = createSlice({
    name: "badges",
    initialState,
    reducers: {
        setBadges: (state, action: PayloadAction<string[]>) => {
        state.unlocked = action.payload;
        },
    },
});

export const { setBadges } = badgesSlice.actions;
export default badgesSlice.reducer;