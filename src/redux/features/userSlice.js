import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        login: (state, actions) => {
            state = actions.payload;
            return state;
        },
        logout: () => {
            return null;
        },
    }
});

export const { login, logout } = userSlice.actions;
export const selectUser = (store) => store.user;
export default userSlice.reducer;