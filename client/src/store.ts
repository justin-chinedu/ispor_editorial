import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { questionSlice } from "./components/questions/questions_slice";
import { useDispatch } from "react-redux";
import { questionAnswersSlice } from "./components/question_answers/question_answers_slice";
import { answerFormSlice } from "./components/answers/answer_form_slice";
import forumSectionApi from "./components/forum_section/forum_section_api";
import { sectionSLice } from "./components/forum_section/section_slice";

export const store = configureStore({
    reducer: {
        question: questionSlice.reducer,
        question_answers: questionAnswersSlice.reducer,
        answer_form: answerFormSlice.reducer,
        section_slice: sectionSLice.reducer,
        [forumSectionApi.reducerPath]: forumSectionApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(forumSectionApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type ThunkApiType = { state: RootState, dispatch: AppDispatch }
export const useAppDispatch: () => AppDispatch = useDispatch;

setupListeners(store.dispatch);
