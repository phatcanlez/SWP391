import { createSlice } from "@reduxjs/toolkit";

const serviceSlide = createSlice({
    name: "service",
    initialState: [],
    reducers: {
        smethod: (state, actions) => {
            const  service = actions.payload;
            state.push(service)
            return state;
        },
    }
});

export const { smethod  } = serviceSlide.actions;
export default serviceSlide.reducer;