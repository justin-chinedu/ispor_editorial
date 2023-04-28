import { ActionReducerMapBuilder, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Answer } from "../../domain/models/answer"
import { Question } from "../../domain/models/question"
import answersDao from "../../domain/dao/answers_dao";
import { AnswerFilter } from "../../domain/dao/filter";
import { RequestState, RequestType } from "../../core/request_state";
import { jprint } from "../../core/utils";

type QuestionState = {
    question?: Question,
    typed_answer: string;
    answers_state: RequestType<Answer[]>
}

type State = {
    [QuestionId in number]: QuestionState
}

const initialState: State = {};

export const fetchAnswersForQuestion = createAsyncThunk('question_answers/fetch_answers', async ( filter: AnswerFilter , thunkApi) => {
    try {
        const answers = await answersDao.fetchAnswersForQuestion(filter);
        return answers;
    } catch (error) {
        return Promise.reject(error)
    }
});


export const questionAnswersSlice = createSlice(
    {
        name: "question_answers",
        initialState: initialState,
        reducers: {
            setUpQuestion: (state, action: PayloadAction<Question>) => {
                const q = action.payload;
                state[q.id!] = { question: q, answers_state: { data: [], state: 'idle' }, typed_answer: '' }
            },
            saveAnswer: (state, action: PayloadAction<{ question: Question, answer: string }>) => {
                const q = action.payload.question;
                state[q.id!].typed_answer = action.payload.answer;
            },

        },
        extraReducers(builder) {
            builder.addCase(fetchAnswersForQuestion.pending, (state, action) => {
                const questionId = action.meta.arg.question_id;
                const s = state[questionId];
                s.answers_state.state = "processing";
                s.answers_state.error = undefined;
            }).addCase(fetchAnswersForQuestion.rejected, (state, action) => {
                const questionId = action.meta.arg.question_id;
                jprint(action.error.message)
                const s = state[questionId];
                s.answers_state.state = "error";
                s.answers_state.error = action.error.message;
            }).addCase(fetchAnswersForQuestion.fulfilled, (state, action) => {
                const questionId = action.meta.arg.question_id;
                const range = action.meta.arg.range;
                const s = state[questionId];
                s.answers_state.state = "success";
                s.answers_state.error = undefined;
                if (range?.from == 0 || range == undefined) {
                    s.answers_state.data = action.payload;
                } else {
                    s.answers_state.data = [...s.answers_state.data, ...action.payload];
                }
            });
        }
    }
)
export const { setUpQuestion, saveAnswer } = questionAnswersSlice.actions;