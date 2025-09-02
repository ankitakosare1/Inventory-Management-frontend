import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,      // {firstName, lastName, email}
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;