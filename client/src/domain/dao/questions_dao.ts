import { PostgrestError } from "@supabase/supabase-js";
import { Question } from "../models/question";
import client from "../services/supabase";
import keyword_extractor from "keyword-extractor";
import { fullStopWords } from "../../core/stopwords";

interface QuestionDaoI {
    addQuestion(question: Question): Promise<number | PostgrestError | null>;
    fetchCount(): Promise<number | null>;
    fetchRecent(): Promise<Question[] | null>;
}

class QuestionDao implements QuestionDaoI {
    async addQuestion(question: Question) {
        let verified = false;
        const keywords =
            keyword_extractor.extract(question.question, {
                language: "english",
                remove_digits: true,
                return_changed_case: true,
                remove_duplicates: true,
                stopwords: fullStopWords
            });

        let result = await client.from('questions').insert({ ...question, keywords, verified });
        if (result.error) {
            return result.error;
        } else {
            return result.count;
        }
    }

    async fetchCount() {
        let count = (await client.from('questions').select("*", { head: true, count: "exact" })).count;
        return count;
    }

    async fetchRecent() {
        let resp = await client.from('questions').select<"*", Question>("*").order('created_at', { ascending: false }).limit(3);
        return resp.data;
    }

}

const questionDao: QuestionDaoI = new QuestionDao();
export default questionDao;