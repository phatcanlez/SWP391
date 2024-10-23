import { combineReducers} from '@reduxjs/toolkit'
import userReducer from "../../src/redux/features/userSlice"
import orderReducer from "../../src/redux/features/orderSlice"
export const rootReducer = combineReducers({
    user: userReducer,
    order: orderReducer,
});