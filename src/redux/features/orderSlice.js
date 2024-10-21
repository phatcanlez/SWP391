import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: null,
    reducers: {
        approve: (state, actions) => {
            state = actions.payload;
            return state;
        },
        done: () => {
            return null;
        },
    }
});

export const { approve, done } = orderSlice.actions;
export default orderSlice.reducer;