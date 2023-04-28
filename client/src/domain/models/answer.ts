export interface Answer {
    created_at: string,
    name: string,
    answer: string,
    verified?: boolean,
    keywords: string[]
    question_id: number
    id?: number
}

export const mockAnswers: Answer[] = [

    {
        id: 11,
        name: 'Anon3dd5454',
        created_at: "2023-04-23T13:22:17.802+00:00",
        answer: "Exercitation incididunt nulla eiusmod qui dolore in ad. Mollit fugiat in fugiat proident. Velit officia excepteur sunt laborum enim id pariatur id qui minim dolor. Officia quis tempor fugiat qui consectetur nisi labore magna. Fugiat labore non mollit labore Lorem sunt laboris. Labore minim laborum eiusmod sunt veniam et. Ad aute deserunt sit duis occaecat reprehenderit consequat cupidatat.",
        keywords: [],
        verified: true,
        question_id: 2
    },

    {
        id: 12,
        name: 'Anon2e454',
        created_at: "2023-04-23T13:22:17.802+00:00",
        answer: "My Test Answer",
        keywords: [],
        verified: true,
        question_id: 2
    },
    {
        id: 14,
        name: 'Anon4445454',
        created_at: "2023-04-23T13:22:17.802+00:00",
        answer: "Exercitation incididunt nulla eiusmod qui dolore in ad. Mollit fugiat in fugiat proident. Velit officia excepteur sunt laborum enim id pariatur id qui minim dolor. Officia quis tempor fugiat qui consectetur nisi labore magna. Fugiat labore non mollit labore Lorem sunt laboris. Labore minim laborum eiusmod sunt veniam et. Ad aute deserunt sit duis occaecat reprehenderit consequat cupidatat.",
        keywords: [],
        verified: true,
        question_id: 2
    },

]