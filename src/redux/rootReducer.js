import { combineReducers} from '@reduxjs/toolkit'
import userReducer from "../../src/redux/features/userSlice"
import orderReducer from "../../src/redux/features/orderSlice"
import countReducer from "../../src/redux/features/countSlice"
export const rootReducer = combineReducers({
    user: userReducer,
    order: orderReducer,
    count: countReducer,
});