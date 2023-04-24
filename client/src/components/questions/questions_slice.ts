import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import questionDao from "../../domain/dao/questions_dao";
import { Question } from "../../domain/models/question";
import { RootState } from "../../store";

type FetchState = 'idle' | 'fetching' | 'error'
type UploadState = 'idle' | 'uploading' | 'error' | 'success'

type State = {
    questions_count: number,
    temp_questions: Question[], //User Temp Questions before verification
    fetch_state: { state: FetchState, error?: string },
    recents_state: { questions: Question[], state: FetchState, error?: string },
    upload_state: { state: UploadState, error?: string },
}

const initialState: State = {
    questions_count: 20,
    fetch_state: { state: 'idle' },
    recents_state: {
        questions: [], state: 'idle'
    },
    upload_state: { state: 'idle' },
    temp_questions: []
}

export const fetchCount = createAsyncThunk('question/fetch_count', async (_, thunkApi) => {
    try {
        return questionDao.fetchCount();
    } catch (error) {
        return Promise.reject(error)
    }
});

export const fetchRecentQuestions = createAsyncThunk('question/fetch_recent', async (_, thunkApi) => {
    try {
        const questions = (await questionDao.fetchRecent()) ?? [];
        return questions;
    } catch (error) {
        return Promise.reject(error)
    }
});

export const addQuestion = createAsyncThunk('question/add_question', async (question: Question, thunkApi) => {
    try {
        let result = await questionDao.addQuestion(question);
        if (typeof result === "number" || result === null) {
            return { result: result, question: question };
        } else {
            return Promise.reject(result.message)
        }
    } catch (error) {
        return Promise.reject(error)
    }
});

export const questionSlice = createSlice({
    name: "question",
    initialState: initialState,
    extraReducers(builder) {
        builder.addCase(fetchCount.pending, (state) => {
            state.fetch_state.state = "fetching"
        }).addCase(fetchCount.fulfilled, (state, action) => {
            if (action.payload) {
                state.questions_count = action.payload;
            }
        }).addCase(fetchCount.rejected, (state, action) => {
            state.fetch_state.error = action.error.message;
            state.fetch_state.state = "error";
        }).addCase(addQuestion.pending, (state) => {
            state.upload_state.state = "uploading"
            state.upload_state.error = undefined;
        }).addCase(addQuestion.fulfilled, (state, action) => {
            state.questions_count += action.payload.result ?? 1;
            state.temp_questions.push(action.payload.question);
            state.upload_state.state = "success";
            state.upload_state.error = undefined;
        }).addCase(addQuestion.rejected, (state, action) => {
            state.upload_state.error = action.error.message;
            state.upload_state.state = "error";
        }).addCase(fetchRecentQuestions.pending, (state) => {
            state.recents_state.state = "fetching"
        }).addCase(fetchRecentQuestions.fulfilled, (state, action) => {
            if (action.payload) {
                state.recents_state.questions = action.payload;
                state.recents_state.state = "idle";
                state.recents_state.error = undefined;
            }
        }).addCase(fetchRecentQuestions.rejected, (state, action) => {
            state.recents_state.error = action.error.message;
            state.recents_state.state = "error";
        });
    },
    reducers: {}
}
);

export const selectQuestionsCount = (state: RootState) => state.question.questions_count;
export const selectQuestionUploadState = (state: RootState) => state.question.upload_state;
export const selectQuestionsFetchState = (state: RootState) => state.question.fetch_state;
export const selectRecentsState = (state: RootState): typeof state.question.recents_state => ({
    ...state.question.recents_state,
    questions: [...state.question.temp_questions, ...state.question.recents_state.questions] //Add temp questions
});

export default questionSlice.reducer;