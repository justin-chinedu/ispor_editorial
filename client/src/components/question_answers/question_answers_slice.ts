import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Answer } from "../../domain/models/answer"
import { Question } from "../../domain/models/question"
import answersDao from "../../domain/dao/answers_dao";
import { AnswerFilter } from "../../domain/dao/filter";
import { RequestType } from "../../core/request_state";
import { deleteVotedQuestionFromLocal, fetchVotedQuestionsFromLocal, jprint, saveVotedQuestionToLocal } from "../../core/utils";
import questionDao from "../../domain/dao/questions_dao";
import { VoteData } from "../../domain/models/user/user_meta";

type QuestionState = {
    question?: Question,
    typed_answer: string;
    answers_state: RequestType<Answer[]>
}

type State = {
    [QuestionId: number]: QuestionState
}

const initialState: State = {};

export const fetchAnswersForQuestion = createAsyncThunk('question_answers/fetch_answers', async (filter: AnswerFilter, thunkApi) => {
    try {
        const answers = await answersDao.fetchAnswersForQuestion(filter);
        return answers;
    } catch (error) {
        return Promise.reject(error)
    }
});

export const updateQuestion = createAsyncThunk('question_answers/update_question', async (question: Question, thunkApi) => {
    try {
        const q = await questionDao.updateQuestion(question);
        return q;
    } catch (error) {
        return Promise.reject(error)
    }
});

export const voteQuestion = createAsyncThunk('question_answers/vote_question', async (arg: { question: Question, isUpvote: boolean, votes: VoteData }, thunkApi) => {
    try {
        const votes = arg.votes;

        const id = arg.question.id!;
        let q: Question;

        if (arg.isUpvote) {
            if (votes.upvoted.includes(id)) {
                q = await questionDao.upvoteQuestion(arg.question, false);
            } else {
                q = await questionDao.upvoteQuestion(arg.question, true);
            }
        } else {
            if (votes.downvoted.includes(id)) {
                q = await questionDao.downvoteQuestion(arg.question, false);
            } else {
                q = await questionDao.downvoteQuestion(arg.question, true);
            }
        }
        return q;
    } catch (error) {
        return Promise.reject(error)
    }
});

export const voteAnswer = createAsyncThunk('question_answers/vote_answer', async (arg: { answer: Answer, isUpvote: boolean, votes: VoteData }, thunkApi) => {
    try {
        const votes = arg.votes;
        
        const id = arg.answer.id!;
        let a: Answer;
        if (arg.isUpvote) {
            if (votes.upvoted.includes(id)) {
                a = await answersDao.upvoteAnswer(arg.answer, false);
            } else {
                a = await answersDao.upvoteAnswer(arg.answer, true);
            }
        } else {
            if (votes.downvoted.includes(id)) {
                a = await answersDao.downvoteAnswer(arg.answer, false);
            } else {
                a = await answersDao.downvoteAnswer(arg.answer, true);
            }
        }
        return a;
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
            }).addCase(voteQuestion.fulfilled, (state, action) => {
                const s = state[action.payload.id!];
                if (s) {
                    s.question = action.payload;
                }
            }).addCase(voteAnswer.fulfilled, (state, action) => {
                const a = action.payload;
                const s = state[action.payload.question_id!];
                s.answers_state.data = s.answers_state.data.map(x => x.id == a.id ? a : x);
            }).addCase(updateQuestion.fulfilled, (state, action) => {
                const s = state[action.payload.id!];
                if (s) {
                    s.question = action.payload;
                }
            }).addCase(updateQuestion.rejected, (state, action) => {
            });
        }
    }
)
export const { setUpQuestion, saveAnswer } = questionAnswersSlice.actions;