export interface Question {
    created_at: string,
    name: string,
    question: string,
    verified?: boolean,
    keywords: string[],
    id?: number,
    upvotes: number,
    downvotes: number,
}

export const mockQuestions: Question[] = [

    {
        id: 11,
        name: 'Anonym3435',
        created_at: "2023-04-23T13:22:17.802+00:00",
        question: "My Test Question",
        keywords: ["malaria", "typhoid", "sickness",  "health"],
        verified: true,
        upvotes: 0,
        downvotes: 0
    },

    {
        id: 434,
        name: 'Anonymsddre5',
        created_at: "2023-04-23T13:22:17.802+00:00",
        question: "My Test Question",
        keywords: [],
        verified: true,
        upvotes: 0,
        downvotes: 0
    }

]