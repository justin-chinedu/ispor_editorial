import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { questionSlice } from "./components/questions/questions_slice";
import { useDispatch } from "react-redux";
import { questionAnswersSlice } from "./components/question_answers/question_answers_slice";
import { enableMapSet } from "immer";
import { answerFormSlice } from "./components/answers/answer_form_slice";

export const store = configureStore({
    reducer: {
        question: questionSlice.reducer,
        question_answers: questionAnswersSlice.reducer,
        answer_form: answerFormSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type ThunkApiType = { state: RootState, dispatch: AppDispatch }
export const useAppDispatch: () => AppDispatch = useDispatch;

setupListeners(store.dispatch);
