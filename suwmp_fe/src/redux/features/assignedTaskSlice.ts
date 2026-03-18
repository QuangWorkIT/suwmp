import { createSlice } from "@reduxjs/toolkit";
import type { AssignedTask } from "@/types/collectorTask";

interface AssignedTaskState {
    currentTask: AssignedTask | null;
    nextTask: AssignedTask | null;
}

const initialState: AssignedTaskState = {
    currentTask: null,
    nextTask: null,
}

export const assignedTaskSlice = createSlice({
    name: "assignedTask",
    initialState,
    reducers: {
        setCurrentTask: (state, action) => {
            state.currentTask = action.payload;
        },
        setNextTask: (state, action) => {
            state.nextTask = action.payload;
        },
        setTaskStatus: (state, action) => {
            state.currentTask = action.payload;
        },
        clearCurrentTask: (state) => {
            state.currentTask = null;
        },
        clearNextTask: (state) => {
            state.nextTask = null;
        },
    }
})

export const { setCurrentTask, setNextTask, setTaskStatus, clearCurrentTask, clearNextTask } = assignedTaskSlice.actions
export default assignedTaskSlice.reducer