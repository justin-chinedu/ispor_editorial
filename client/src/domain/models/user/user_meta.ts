export type VoteData = { upvoted: number[], downvoted: number[] }
export interface UserMeta {
    question_votes: VoteData,
    answer_votes: VoteData,
}