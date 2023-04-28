import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Answer } from "../../domain/models/answer";
import answersDao from "../../domain/dao/answers_dao";
import { RequestState } from "../../core/request_state";
import { RootState } from "../../store";

export const addAnswer = createAsyncThunk('answer_form/add_answer', async (answer: Answer, thunkApi) => {
    try {
        let result = await answersDao.addAnswer(answer);
        if (result) {
            return Promise.reject(result.message)
        }
    } catch (error) {
        return Promise.reject(error)
    }
});

type FormState = {
    uploadState: RequestState,
    error?: string
}
const initialState: FormState = {
    uploadState: "idle"
};

export const answerFormSlice = createSlice(
    {
        name: "answer_form",
        initialState: initialState,
        reducers: {},
        extraReducers(builder) {
            builder.addCase(addAnswer.pending, (state) => {
                state.uploadState = "processing";
                state.error = undefined;
            }).addCase(addAnswer.fulfilled, (state, _action) => {
                state.uploadState = "success";
                state.error = undefined;
            }).addCase(addAnswer.rejected, (state, action) => {
                state.uploadState = "error";
                state.error = action.error.message
            });
        }
    }
)

export const selectAnswerFormState = (state: RootState) => state.answer_form;

