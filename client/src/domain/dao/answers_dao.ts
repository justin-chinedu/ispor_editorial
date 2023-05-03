import { PostgrestError } from "@supabase/supabase-js";
import client from "../services/supabase";
import keyword_extractor from "keyword-extractor";
import { fullStopWords } from "../../core/stopwords";
import { Answer, mockAnswers } from "../models/answer";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { AnswerFilter, AnswerColumns, AnswerValues } from "./filter";

interface AnswersDaoI {
    addAnswer(answer: Answer): Promise<PostgrestError | void>;
    updateAnswer(answer: Answer): Promise<Answer>;
    fetchAnswersForQuestion(filter: AnswerFilter): Promise<Answer[]>;
    upvoteAnswer(answer: Answer, increase: boolean): Promise<Answer>;
    downvoteAnswer(answer: Answer, increase: boolean): Promise<Answer>;
}

class AnswersDao implements AnswersDaoI {
    async updateAnswer(answer: Answer): Promise<Answer> {
        const resp = await client.from('answers')
            .update(answer)
            .eq('id', answer.id!)
            .select<"*", Answer>('*')
            .single();

        if (resp.error) {
            throw resp.error;
        } else {
            return resp.data;
        }
    }
    async fetchAnswersForQuestion(filter: AnswerFilter): Promise<Answer[]> {
        // return Promise.resolve(mockAnswers);

        let builder = client.from('answers')
            .select<"*", Answer>("*");

        builder = this.applyFilter(builder, filter);
        const resp = await builder;

        if (resp.error) {
            throw resp.error;
        } else {
            return resp.data;
        }
    }
    async upvoteAnswer(answer: Answer, increase: boolean): Promise<Answer> {
        const { data, error } = await client.rpc('upvote_answer', { answer_id: answer.id!, increase: increase })
        if (error) {
            throw error;
        } else {
            return { ...answer, upvotes: increase ? answer.upvotes + 1 : answer.upvotes == 0 ? 0 : answer.upvotes - 1 };
        }
    }

    async downvoteAnswer(answer: Answer, increase: boolean): Promise<Answer> {
        const { data, error } = await client.rpc('downvote_answer', { answer_id: answer.id!, increase: increase })
        if (error) {
            throw error;
        } else {
            return { ...answer, downvotes: increase ? answer.downvotes + 1 : answer.downvotes == 0 ? 0 : answer.downvotes - 1 };
        }
    }

    applyFilter(builder: PostgrestFilterBuilder<GenericSchema, Record<AnswerColumns, AnswerValues>, Answer[]>, filter: AnswerFilter) {

        builder = builder.eq("question_id", filter.question_id);

        if (filter.relevance) {
            builder = builder.order(filter.relevance.by, { ascending: filter.relevance.order === "asc" });
        }

        if (filter.order_by) {
            builder = builder.order(filter.order_by.by, { ascending: filter.order_by.order === "asc" });
        }

        if (filter.range) {
            builder = builder.range(filter.range.from, filter.range.to);
        }
        if (filter.verified !== undefined) {
            builder = builder.eq("verified", filter.verified);
        }

        if (filter.limit) {
            builder = builder.limit(filter.limit);
        }
        return builder;
    }

    async addAnswer(answer: Answer) {
        let verified = false;
        const keywords =
            keyword_extractor.extract(answer.answer, {
                language: "english",
                remove_digits: true,
                return_changed_case: true,
                remove_duplicates: true,
                stopwords: fullStopWords
            });

        let result = await client.from('answers').insert({ ...answer, keywords, verified });
        if (result.error) {
            return result.error;
        }
    }

}


const answersDao: AnswersDaoI = new AnswersDao();
export default answersDao;