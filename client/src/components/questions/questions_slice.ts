import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import questionDao from "../../domain/dao/questions_dao";
import { QuestionFilter } from "../../domain/dao/filter";
import { Question } from "../../domain/models/question";
import { RootState } from "../../store";
import { RequestType } from "../../core/request_state";

type FetchState = 'idle' | 'processing' | 'error'
type UploadState = 'idle' | 'processing' | 'error' | 'success'

type State = {
    //Questions State
    questions_count: number,
    questions_state: RequestType<Question[]>,
    questions_filter: QuestionFilter
    //---------
    temp_questions: Question[], //User Temp Questions before verification
    fetch_state: RequestType<undefined>,
    recents_state: RequestType<Question[]>,
    upload_state: RequestType<undefined>,
}

const initialState: State = {
    questions_count: -1,
    questions_filter: {},
    fetch_state: { state: 'idle', data: undefined },
    questions_state: { state: 'idle', data: [] },
    recents_state: {
        data: [], state: 'idle'
    },
    upload_state: { state: 'idle', data: undefined },
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
        const questions = (await questionDao.fetchQuestions({ limit: 3, order_by: { by: "created_at", order: "asc" }, verified: true })) ?? [];
        return questions;
    } catch (error) {
        return Promise.reject(error)
    }
});

export const fetchAllQuestions = createAsyncThunk<Question[], undefined, { state: RootState }>('question/fetch_all_questions', async (_, thunkApi) => {
    try {
        const questions = (await questionDao.fetchQuestions(thunkApi.getState().question.questions_filter)) ?? [];
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
            state.fetch_state.state = "processing"
        }).addCase(fetchCount.fulfilled, (state, action) => {
            if (action.payload) {
                state.questions_count = action.payload;
            }
        }).addCase(fetchCount.rejected, (state, action) => {
            state.fetch_state.error = action.error.message;
            state.fetch_state.state = "error";
        }).addCase(addQuestion.pending, (state) => {
            state.upload_state.state = "processing"
            state.upload_state.error = undefined;
        }).addCase(addQuestion.fulfilled, (state, action) => {
            state.questions_count += action.payload.result ?? 1;
            state.temp_questions.push(action.payload.question);
            state.upload_state.state = "success";
            state.upload_state.error = undefined;
        }).addCase(addQuestion.rejected, (state, action) => {
            state.upload_state.error = action.error.message;
            state.upload_state.state = "error";
        })
            //Recent Questions
            .addCase(fetchRecentQuestions.pending, (state) => {
                state.recents_state.state = "processing"
            }).addCase(fetchRecentQuestions.fulfilled, (state, action) => {
                if (action.payload) {
                    state.recents_state.data = action.payload;
                    state.recents_state.state = "idle";
                    state.recents_state.error = undefined;
                }
            }).addCase(fetchRecentQuestions.rejected, (state, action) => {
                state.recents_state.error = action.error.message;
                state.recents_state.state = "error";
            })
            //ALL Questions
            .addCase(fetchAllQuestions.pending, (state) => {
                state.questions_state.state = "processing"
                state.questions_state.error = undefined;
            }).addCase(fetchAllQuestions.fulfilled, (state, action) => {
                const range = state.questions_filter.range;
                const first_run = range?.from == 0;

                if (action.payload && range && (range.to != state.questions_state.data.length)) { //raange must specify greater value before adding data
                    if (first_run) { //Append to questions is range is used and is not first run
                        state.questions_state.data = [...action.payload];
                    } else { //Reset questions if range is not used
                        state.questions_state.data = [...state.questions_state.data, ...action.payload];
                    }

                }
                state.questions_state.state = "success"
                state.questions_state.error = undefined;
            }).addCase(fetchAllQuestions.rejected, (state, action) => {
                state.questions_state.error = action.error.message;
                state.questions_state.state = "error"
            });
    },
    reducers: {
        setFilter: (state, action: PayloadAction<QuestionFilter>) => {
            state.questions_filter = action.payload;
        }
    }
}
);

export const selectQuestionsCount = (state: RootState) => state.question.questions_count;
export const selectQuestionsFilter = (state: RootState) => state.question.questions_filter;
export const selectQuestionUploadState = (state: RootState) => state.question.upload_state;
export const selectQuestionsFetchState = (state: RootState) => state.question.fetch_state;
export const selectRecentsState = (state: RootState): typeof state.question.recents_state => ({
    ...state.question.recents_state,
    data: [...state.question.temp_questions, ...state.question.recents_state.data] //Add temp questions
});

export const selectAllQuestionsState = (state: RootState): typeof state.question.questions_state => state.question.questions_state;

export const { setFilter } = questionSlice.actions;
export default questionSlice.reducer;