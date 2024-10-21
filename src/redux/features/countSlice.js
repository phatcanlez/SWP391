import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    value: 1,
}

export const countSlice = createSlice({
    name: "count",
    initialState,
    reducers: {
        increase: (state) => {
            if (state.value < 3) { 
                state.value += 1;
              }
        },
        reset: () => initialState,
    }
});

export const { increase, reset } = countSlice.actions;
export default countSlice.reducer;