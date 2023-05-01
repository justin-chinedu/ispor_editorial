import keyword_extractor from "keyword-extractor";
import { ANON_SAVE_KEY, ANON_VOTE_KEY } from "./constants";
import { fullStopWords } from "./stopwords";

export function jprint(value: any) {
    console.log(JSON.stringify(value));
}

export function generateName() {
    const uuid = crypto.randomUUID();
    return "Anon" + uuid.slice(0, 7);
}

export function saveNameToLocal(name: string) {
    if (name.trim().length > 0) {
        localStorage.setItem(ANON_SAVE_KEY, name);
    }
}

export function saveVotedQuestionToLocal(id: number, isUpvote: boolean) {
    const saved = fetchVotedQuestionsFromLocal();
    if (isUpvote) {
        if (saved.upvoted.includes(id)) return;
        saved.upvoted.push(id);
    } else {
        if (saved.downvoted.includes(id)) return;
        saved.downvoted.push(id);
    }
    localStorage.setItem(ANON_VOTE_KEY, JSON.stringify(saved));
}

export function deleteVotedQuestionFromLocal(id: number, isUpvote: boolean) {
    const saved = fetchVotedQuestionsFromLocal();
    if (isUpvote) {
        if (!saved.upvoted.includes(id)) return;
        const i = saved.upvoted.indexOf(id);
        saved.upvoted.splice(i, 1)
    } else {
        if (!saved.downvoted.includes(id)) return;
        const i = saved.downvoted.indexOf(id);
        saved.downvoted.splice(i, 1)
    }
    localStorage.setItem(ANON_VOTE_KEY, JSON.stringify(saved));
}

export type VoteType = { upvoted: number[], downvoted: number[] }

export function fetchVotedQuestionsFromLocal(): VoteType {
    const saved = localStorage.getItem(ANON_VOTE_KEY);
    const def = { upvoted: [], downvoted: [] };
    return saved ? JSON.parse(saved) : def;
}

export function fetchNameFromLocal() {
    const name = localStorage.getItem(ANON_SAVE_KEY);
    return name;
}

export function extractKeyword(text: string) {
    return keyword_extractor.extract(text, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
        stopwords: fullStopWords
    });
}

