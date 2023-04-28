import { useSelector } from "react-redux";
import { Question } from "../../domain/models/question";
import { RootState, useAppDispatch } from "../../store";
import { fetchAnswersForQuestion, setUpQuestion } from "./question_answers_slice";
import { useEffect, useState } from "react";
import { QuestionAnswerBubble } from "../questions/question_answer_bubble";
import InfoRounded from "@mui/icons-material/InfoRounded";
import MessageRounded from "@mui/icons-material/MessageRounded";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import UploadRounded from "@mui/icons-material/UploadRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import { AnswerForm } from "../answers/answer_form";
import { AnswerFilter, RangeFilter } from "../../domain/dao/filter";
import { answerFilterSections, sectionsToAnswerFilter } from "../filters/filters";
import { FilterFrame } from "../filters/filter_frame";
import { FilterButton } from "../filters/filter_button";
import { jprint } from "../../core/utils";

export const QuestionAnswers = ({ question }: { question: Question }) => {
    const dispatch = useAppDispatch();
    const perPage = 10;
    const [range, setRange] = useState<RangeFilter>({ from: 0, to: perPage })

    const [formIsVisible, setFormIsVisible] = useState(false);
    const [filterIsVisible, setFilterIsVisible] = useState(false);
    const [filterSections, setFilterSections] = useState(answerFilterSections);

    const answersFilter = { range, ...sectionsToAnswerFilter(filterSections, question.id!) }

    const questionState = useSelector((state: RootState) => {
        if (question.id && question.id in state.question_answers) {
            return state.question_answers[question.id];
        }
    });

    useEffect(() => {
        if (questionState == undefined) {
            dispatch(setUpQuestion(question))
        }
    }, [questionState, question])

    const isLoading = questionState?.answers_state.state == "processing";
    const isSuccess = questionState?.answers_state.state == "success";
    const isIdle = questionState?.answers_state.state == "idle";
    const isError = questionState?.answers_state.state == "error";

    useEffect(() => {
        dispatch(fetchAnswersForQuestion(answersFilter));
    }, [question.id, filterSections])

    function onFilter(sections: typeof answerFilterSections) {
        setRange({ from: 0, to: perPage });
        setFilterSections(sections);
        setFilterIsVisible(false);
    }

    const answers = questionState?.answers_state.data ?? [];
    const answersIsNotEmpty = answers.length > 0;
    const verificationSection = filterSections.filter(s => s.filter_key == "verified").pop();
    const verificationText = verificationSection?.options[verificationSection.selectedOption].title;


    return (
        <div className="relative h-full flex flex-col gap-y-4">

            <h2 className="text-white text-xs font-light">Question</h2>
            {/* Question */}
            <QuestionAnswerBubble answerCount={answers.length} question_or_answer={question} />

            {/* Vote and Answer Buttons */}
            <div className="flex justify-end text-white items-center">
                <button type="button" className="mr-2 text-emerald-200">
                    <UploadRounded fontSize="inherit" /> {677}
                </button>
                <button type="button" className="mr-6 text-red-200">
                    <DownloadRounded fontSize="inherit" /> {78}
                </button>
                {/* Answer Button */}
                <button type="button" onClick={() => setFormIsVisible(s => !s)} className="text-lg text-white flex justify-end items-center gap-x-2 hover:bg-slate-700/50 rounded-lg w-fit p-2">
                    {formIsVisible ? <VisibilityRounded fontSize="inherit" /> : <MessageRounded fontSize="inherit" />}
                    <p className="text-[12px]">{formIsVisible ? "Show Only Answers" : "Answer Question"}</p>
                </button>
            </div>

            {/*All Answers */}
            {
                isLoading ?
                    <p className="my-4 text-white text-center">Loading Answers...</p>
                    :
                    ((isSuccess || isIdle) ?
                        <>
                            {
                                //  Sort & Answers List 
                                !formIsVisible ?
                                    <div className="flex flex-col gap-y-4 mb-6">
                                        <hr className="opacity-50" />

                                        <div className="flex justify-between items-center">
                                            <h2 className="text-white text-xs">All Answers</h2>
                                            {/* Sort Button */}
                                            <FilterButton active={filterIsVisible} onClick={() => setFilterIsVisible(v => !v)} />
                                        </div>
                                        {/* Filter Frame */}
                                        {filterIsVisible &&
                                            <FilterFrame sections={filterSections} onFilter={onFilter} />
                                        }

                                        {/* Answers list */}
                                        {answersIsNotEmpty ?
                                            answers.map(a => <QuestionAnswerBubble key={a.id} question_or_answer={a} />)
                                            : <p className="my-4 text-white text-center">No {verificationText ?? ""} Answers</p>
                                        }
                                    </div>
                                    :
                                    <div className=" bg-gray-800 pt-4 grow flex flex-col gap-y-6 justify-end mt-4 mb-8">
                                        {answersIsNotEmpty ? null : <p className="text-white text-xs">Be the First To Answer</p>}
                                        <AnswerForm answerFilter={answersFilter} question={question} />
                                    </div>
                            }

                        </>
                        : isError ?
                            // Error
                            <div className="flex flex-col items-center gap-y-4 mt-6">
                                <div className="flex items-center">
                                    <span className={"text-red-200/80 mr-2 text-sm"}>{<InfoRounded fontSize="small" />}</span>
                                    <span className={"text-red-200/80 text-sm"}>{"Error fetching answers"}</span>
                                </div>
                                <button onClick={() => dispatch(fetchAnswersForQuestion(answersFilter))} className="bg-red-200/80 hover:bg-red-300/80  text-gray-700 py-2 px-4 rounded-lg text-sm" type="button"> Retry</button>
                            </div> : null
                    )
            }
        </div >
    )

}

export const VoteButtons = ({question}: {question: Question}) => {
    const questionState = useSelector((state: RootState) => {
        if (question.id && question.id in state.question_answers) {
            return state.question_answers[question.id];
        }
    });
    const dispatch = useAppDispatch();


    return (
        <div className="flex gap-x-2 items-center">
            <button type="button" className=" text-emerald-200">
                <UploadRounded fontSize="inherit" /> {question.upvotes}
            </button>
            <button type="button" className=" text-red-200">
                <DownloadRounded fontSize="inherit" /> {question.downvotes}
            </button>
        </div>
    )
}
