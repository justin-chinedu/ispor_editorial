export interface Question {
    created_at: string,
    question: string,
    verified?: boolean,
    keywords: string[]
    answer_id?: number
}