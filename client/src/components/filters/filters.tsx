import TimerRounded from "@mui/icons-material/TimerRounded"
import VerifiedRounded from "@mui/icons-material/VerifiedRounded"
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded"
import { AnswerFilter, AnswerFilterKeys, OrderByFilter, QuestionFilter, QuestionFilterKeys, RelevanceFilter } from "../../domain/dao/filter"

export type FilterSection<OptionValueType> = {
    title: string,
    icon: JSX.Element,
    selectedOption: number, // -1 for no default value
    filter_key: AnswerFilterKeys | QuestionFilterKeys,
    options: { title: string, value: OptionValueType, messageOnSelected?: string }[]
}

const timeFilterSection: FilterSection<OrderByFilter> = {
    title: "Time",
    icon: <TimerRounded fontSize="small" />,
    selectedOption: 0,
    filter_key: "order_by",
    options: [
        { title: "Most Recent", value: { by: "created_at", order: "desc" } },
        { title: "Oldest", value: { by: "created_at", order: "asc" } },
    ]
}

const answerVerificationSection: FilterSection<boolean | undefined> = {
    title: "Verification",
    icon: <VerifiedRounded fontSize="small" />,
    selectedOption: 2,
    filter_key: "verified",
    options: [
        { title: "Verified", value: true },
        { title: "Unverified", value: false, messageOnSelected: "Answers could contain explicit or offensive content" },
        { title: "All answers", value: undefined, messageOnSelected: "Answers could contain explicit or offensive content" },
    ]
}

const questionVerificationSection: FilterSection<boolean | undefined> = {
    title: "Verification",
    icon: <VerifiedRounded fontSize="small" />,
    selectedOption: 0,
    filter_key: "verified",
    options: [
        { title: "Verified", value: true },
        { title: "Unverified", value: false, messageOnSelected: "Questions could contain explicit or offensive content" },
        { title: "All questions", value: undefined, messageOnSelected: "Questions could contain explicit or offensive content" },
    ]
}

const questionRelevanceSection: FilterSection<RelevanceFilter | undefined> = {
    title: "Relevance",
    icon: <TrendingUpRounded fontSize="small" />,
    selectedOption: 0,
    filter_key: "relevance",
    options: [
        { title: "Most Relevant", value: { by: "upvotes", order: "desc" } },
        { title: "All Questions", value: undefined },
    ]
}

const answerRelevanceSection: FilterSection<RelevanceFilter | undefined> = {
    title: "Relevance",
    icon: <TrendingUpRounded fontSize="small" />,
    selectedOption: 0,
    filter_key: "relevance",
    options: [
        { title: "Most Relevant", value: { by: "upvotes", order: "desc" } },
        { title: "All Questions", value: undefined },
    ]
}


export const answerFilterSections = [timeFilterSection, answerVerificationSection, questionRelevanceSection]
export const questionFilterSections = [timeFilterSection, questionVerificationSection, questionRelevanceSection]

export function sectionsToAnswerFilter(sections: typeof answerFilterSections, questionId: number): AnswerFilter {
    const filter: AnswerFilter = { question_id: questionId }

    for (const section of sections) {
        if (section.selectedOption >= 0) {
            switch (section.filter_key) {
                case "order_by":
                    filter[section.filter_key] = section.options[section.selectedOption].value as OrderByFilter | undefined;
                    break;
                case "verified":
                    filter[section.filter_key] = section.options[section.selectedOption].value as boolean | undefined;
                    break;
                case "relevance":
                    filter[section.filter_key] = section.options[section.selectedOption].value as RelevanceFilter | undefined;
                    break;
            }
        }
    }

    return filter;
}

export function sectionsToQuestionFilter(sections: typeof questionFilterSections): QuestionFilter {
    const filter: QuestionFilter = {}

    for (const section of sections) {
        if (section.selectedOption >= 0) {
            switch (section.filter_key) {
                case "order_by":
                    filter[section.filter_key] = section.options[section.selectedOption].value as OrderByFilter;
                    break;
                case "verified":
                    filter[section.filter_key] = section.options[section.selectedOption].value as boolean | undefined;
                    break;
                case "relevance":
                    filter[section.filter_key] = section.options[section.selectedOption].value as RelevanceFilter | undefined;
                    break;
            }
        }
    }

    return filter;
}
