import { createSlice } from "@reduxjs/toolkit";
import type { UserInterface } from '@/types/Users'


interface UserState {
    user: UserInterface | null;
    token: string | null
}


const initialState: UserState = {
    user: null,
    token: null
}


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        }
    }
})

export const { login } = userSlice.actions
export default userSlice.reducer