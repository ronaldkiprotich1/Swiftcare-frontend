import { createSlice } from "@reduxjs/toolkit";


export type UserState = {
    token: string | null;
    user: {
        user_id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
    } | null;
} // how the user state will look like in the store

const initialState: UserState = {
    token: null,
    user: null,
} //By default, there is no token and no user (not logged in).

const userSlice = createSlice({ // createSlice is a function that creates a slice of the Redux store- a slice in simple terms is a part of the store that contains a specific piece of state and the reducers that update that state.
    name: 'user', // name of the slice, this will be used as a key in the store
    initialState, // initial state of the slice
    reducers: { //a reducer is a function that takes the current state and an action, and returns a new state
        loginSuccess: (state, action) => {
            state.token = action.payload.token; // the token is set when the user logs in successfully
            state.user = action.payload.user; // the user is set when the user logs in successfully
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
        }
    }
})

export const { loginSuccess, logout } = userSlice.actions; // export the actions so that they can be dispatched from components
export default userSlice.reducer;