import { PostgrestError } from "@supabase/supabase-js";
import { Question, mockQuestions } from "../models/question";
import client from "../services/supabase";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { GenericSchema } from "@supabase/postgrest-js/dist/module/types";
import { QuestionColumns, QuestionFilter, QuestionValues } from "./filter";
import { extractKeyword as extractKeywords, jprint } from "../../core/utils";

interface QuestionDaoI {
    addQuestion(question: Question): Promise<number | PostgrestError | null>;
    updateQuestion(question: Question): Promise<Question>;
    upvoteQuestion(question: Question, increase: boolean): Promise<Question>;
    downvoteQuestion(question: Question, increase: boolean): Promise<Question>;
    fetchCount(): Promise<number | null>;
    fetchRecent(): Promise<Question[] | null>;
    fetchQuestions(filter: QuestionFilter): Promise<Question[]>;
}

let i = 60;
class QuestionDao implements QuestionDaoI {


    async upvoteQuestion(question: Question, increase: boolean): Promise<Question> {
        const { data, error } = await client.rpc('upvote_question', { question_id: question.id!, increase: increase })
        if (error) {
            throw error;
        } else {
            return { ...question, upvotes: increase ? question.upvotes + 1 : question.upvotes == 0 ? 0 : question.upvotes - 1 };
        }
    }

    async downvoteQuestion(question: Question, increase: boolean): Promise<Question> {
        const { data, error } = await client.rpc('downvote_question', { question_id: question.id!, increase: increase })
        if (error) {
            throw error;
        } else {
            return { ...question, downvotes: increase ? question.downvotes + 1 : question.downvotes == 0 ? 0 : question.downvotes - 1 };
        }
    }

    async updateQuestion(question: Question): Promise<Question> {
        const resp = await client.from('questions')
            .update(question)
            .eq('id', question.id!)
            .select<"*", Question>('*')
            .single();

        if (resp.error) {
            throw resp.error;
        } else {
            return resp.data;
        }
    }

    async fetchQuestions(filter: QuestionFilter): Promise<Question[]> {

        // return [...([...mockQuestions, ...mockQuestions,].map((q) => {
        //     i += 234;
        //     const name = `anon${i}`;
        //     return { ...q, id: i, name };
        // }))]

        let builder = client.from('questions')
            .select<string, Question>("*");

        builder = this.applyFilter(builder, filter);
        const resp = await builder;

        if (resp.error) {
            throw resp.error;
        } else {
            return resp.data;
        }
    }

    applyFilter(builder: PostgrestFilterBuilder<GenericSchema, Record<QuestionColumns, QuestionValues>, Question[]>, filter: QuestionFilter) {
        if (filter.verified !== undefined) {
            builder = builder.eq("verified", filter.verified);
        }

        if (filter.section_ids && filter.section_ids.length > 0  && filter.keyword == undefined) {
            builder = builder.in("section_id", filter.section_ids);
        }

        if (filter.keyword) {
            const keywords =
                extractKeywords(filter.keyword);
            builder = builder.contains("keywords", keywords);
        }

        if (filter.relevance) {
            builder = builder.order(filter.relevance.by, { ascending: filter.relevance.order === "asc" });
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
            [...extractKeywords(question.question), question.name.toLocaleLowerCase().trim()];

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