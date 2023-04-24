import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { questionSlice } from "./components/questions/questions_slice";
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        question: questionSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type ThunkApiType = { state: RootState, dispatch: AppDispatch }
export const useAppDispatch: () => AppDispatch = useDispatch;

setupListeners(store.dispatch);
