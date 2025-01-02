import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';

// const rootReducer = combineReducers({
//     user: userReducer
// });

const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default store;