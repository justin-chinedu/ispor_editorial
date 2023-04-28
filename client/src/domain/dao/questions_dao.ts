import { PostgrestError } from "@supabase/supabase-js";
import { Question, mockQuestions } from "../models/question";
import client from "../services/supabase";
import keyword_extractor from "keyword-extractor";
import { fullStopWords } from "../../core/stopwords";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { GenericSchema } from "@supabase/postgrest-js/dist/module/types";
import { QuestionColumns, QuestionFilter, QuestionValues } from "./filter";

interface QuestionDaoI {
    addQuestion(question: Question): Promise<number | PostgrestError | null>;
    updateQuestion(question: Question): Promise<Question | PostgrestError>;
    fetchCount(): Promise<number | null>;
    fetchRecent(): Promise<Question[] | null>;
    fetchQuestions(filter: QuestionFilter): Promise<Question[]>;
}

let i = 60;
class QuestionDao implements QuestionDaoI {

    async updateQuestion(question: Question): Promise<Question | PostgrestError> {
        const resp = await client.from('questions')
            .update(question)
            .select<"*", Question>('*')
            .single();

        if (resp.error) {
            throw resp.error;
        } else {
            return resp.data;
        }
    }
    
    async fetchQuestions(filter: QuestionFilter): Promise<Question[]> {

        return [...([...mockQuestions, ...mockQuestions,].map((q) => {
            i += 234;
            const name = `anon${i}`;
            return { ...q, id: i, name };
        }))]

        // let builder = client.from('questions')
        //     .select<"*", Question>("*");

        // builder = this.applyFilter(builder, filter);
        // const resp = await builder;

        // if (resp.error) {
        //     throw resp.error;
        // } else {
        //     return resp.data;
        // }
    }

    applyFilter(builder: PostgrestFilterBuilder<GenericSchema, Record<QuestionColumns, QuestionValues>, Question[]>, filter: QuestionFilter) {
        if (filter.verified !== undefined) {
            builder = builder.eq("verified", filter.verified);
        }

        if (filter.keyword) {
            builder = builder.contains("keywords", [filter.keyword]);
        }

        if (filter.order_by) {
            builder = builder.order(filter.order_by.by, { ascending: filter.order_by.order === "asc" });
        }
        if (filter.range) {
            builder = builder.range(filter.range.from, filter.range.to);
        }
        if (filter.limit) {
            builder = builder.limit(filter.limit);
        }

        return builder;
    }

    async addQuestion(question: Question) {
        let verified = false;
        const keywords =
            keyword_extractor.extract(question.question, {
                language: "english",
                remove_digits: true,
                return_changed_case: true,
                remove_duplicates: true,
                return_chained_words: true,
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
        let resp = await client.from('questions')
            .select<"*", Question>("*")
            .eq("verified", true)
            .order('created_at', { ascending: false })
            .limit(3);
        return resp.data;
    }

}



const questionDao: QuestionDaoI = new QuestionDao();
export default questionDao;