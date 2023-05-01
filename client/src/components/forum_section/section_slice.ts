import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ForumSection } from "../../domain/models/forum_section";
import { RootState } from "../../store";
type ForumState = {
    selected: number[]
}
const initialState: ForumState = {
    selected: []
}

export const sectionSLice = createSlice(
    {
        initialState: initialState,
        name: "forum_section_slice",
        reducers: {
            setForumState(state, action: PayloadAction<number[]>) {
                state.selected = action.payload;
            }
        }
    }
)

export const selectForumState = (state: RootState) => state.section_slice.selected;
export const { setForumState } = sectionSLice.actions;