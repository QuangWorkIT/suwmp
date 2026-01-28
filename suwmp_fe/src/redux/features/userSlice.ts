import { createSlice } from "@reduxjs/toolkit";
import type { UserInterface } from '@/types/Users'


interface UserState {
    user: UserInterface | null;
    token: string | null,
    initialized: boolean
}


const initialState: UserState = {
    user: null,
    token: null,
    initialized: false
}


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token),
            state.initialized = true
        },
        authInitialized: (state) => {
            state.initialized = true
        }
    }
})

export const { login, authInitialized } = userSlice.actions
export default userSlice.reducer