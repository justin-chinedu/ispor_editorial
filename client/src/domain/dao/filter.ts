import { Answer } from "../models/answer";
import { Question } from "../models/question";

export type OrderByFilter = { by: "created_at", order: "asc" | "desc" }
export type RelevanceFilter = { by: "upvotes" | "downvotes", order: "asc" | "desc" }

export type KeywordFilter = string | null
export type RangeFilter = { from: number, to: number }

export type AnswerFilter = {
    limit?: number,
    range?: RangeFilter,
    order_by?: OrderByFilter,
    keyword?: KeywordFilter,
    verified?: boolean,
    question_id: number
}

export type AnswerFilterKeys = keyof AnswerFilter;
export type AnswerColumns = keyof Answer;
export type AnswerValues = Answer[keyof Answer];


export type QuestionFilter = {
    limit?: number,
    range?: RangeFilter,
    order_by?: OrderByFilter,
    keyword?: KeywordFilter,
    verified?: boolean,
    relevance?: RelevanceFilter
    section_ids ?: number[]
}

export type QuestionFilterKeys = keyof QuestionFilter;
export type QuestionColumns = keyof Question;
export type QuestionValues = Question[keyof Question];