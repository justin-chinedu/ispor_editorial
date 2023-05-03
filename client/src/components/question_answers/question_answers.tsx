import { Question } from "../../domain/models/question";
import { useAppDispatch } from "../../store";
import { fetchAnswersForQuestion, setUpQuestion, updateQuestion } from "./question_answers_slice";
import { useEffect, useState } from "react";
import { QABubblePlaceHolder, QuestionAnswerBubble } from "../questions/question_answer_bubble";
import InfoRounded from "@mui/icons-material/InfoRounded";
import MessageRounded from "@mui/icons-material/MessageRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import { AnswerForm } from "../answers/answer_form";
import { RangeFilter } from "../../domain/dao/filter";
import { answerFilterSections, sectionsToAnswerFilter } from "../filters/filters";
import { FilterFrame } from "../filters/filter_frame";
import { FilterButton } from "../filters/filter_button";
import { useQuestionSelector } from "../../hooks/question_hooks";
import { VoteAnswerButtons, VoteButtons } from "./vote_buttons";
import { useGetUser } from "../auth/auth_api";
import { jprint } from "../../core/utils";

export const QuestionAnswers = ({ question }: { question: Question }) => {
    const userState = useGetUser();
    const is_mod: boolean = userState.data?.app_metadata?.claims_admin == true;

    const dispatch = useAppDispatch();
    const perPage = 10;
    const [range, setRange] = useState<RangeFilter>({ from: 0, to: perPage })

    const [formIsVisible, setFormIsVisible] = useState(false);
    const [filterIsVisible, setFilterIsVisible] = useState(false);
    const [filterSections, setFilterSections] = useState(answerFilterSections);

    const answersFilter = { range, ...sectionsToAnswerFilter(filterSections, question.id!) }

    const questionState = useQuestionSelector(question);
    question = questionState?.question ?? question;

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

    function handleVerifyQuestion() {
        if (question.verified) {
            dispatch(updateQuestion({ ...question, verified: false }))
        } else {
            dispatch(updateQuestion({ ...question, verified: true }))
        }
    }

    return (
        <div className="relative h-full flex flex-col gap-y-4">

            {is_mod &&
                <h2 className="self-center text-white/60 text-sm font-semibold">You're a Moderator</h2>
            }
            <h2 className="text-white text-xs font-light">Question</h2>
            {/* Question */}
            <QuestionAnswerBubble answerCount={answers.length} question_or_answer={question} />
            {/* Verification for mods */}
            {
                is_mod &&
                <button onClick={handleVerifyQuestion} className={"w-fit self-end rounded-lg p-2 px-4 text-xs text-white " + (question.verified ? "bg-red-600/70 " : "bg-emerald-600")} type="button">{question.verified ? "UnVerify Question" : "Verify Question"}</button>
            }

            {/* Vote and Answer Buttons */}
            <div className="flex justify-end gap-x-4 text-white items-center">
                <VoteButtons question={question} />
                {/* Answer Button */}
                <button type="button" onClick={() => setFormIsVisible(s => !s)} className="text-lg text-white flex justify-end items-center gap-x-2 hover:active:bg-slate-700/50 rounded-lg w-fit p-2">
                    {formIsVisible ? <VisibilityRounded fontSize="inherit" /> : <MessageRounded fontSize="inherit" />}
                    <p className="text-[12px]">{formIsVisible ? "Show Answers" : "Answer Question"}</p>
                </button>
            </div>


            {/*All Answers */}
            {
                isLoading ?
                    <div className="animate-pulse flex flex-col gap-y-4">
                        {
                            [...Array(3).keys()].map((_, i) => <QABubblePlaceHolder reverse key={i} />)
                        }
                    </div> :
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
                                            answers.map(a => (
                                                <div key={a.id} className="flex justify-end items-center gap-x-4 mb-6">
                                                    <VoteAnswerButtons answer={a} question={question} />
                                                    <div className="grow">
                                                        <QuestionAnswerBubble question_or_answer={a} />
                                                    </div>
                                                </div>)
                                            )
                                            : <p className="my-4 whitespace-break-spaces text-white text-center">{"No answers yet \nTry changing filter settings"}</p>
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
                                <button onClick={() => dispatch(fetchAnswersForQuestion(answersFilter))} className="bg-red-200/80 hover:active:bg-red-300/80  text-gray-700 py-2 px-4 rounded-lg text-sm" type="button"> Retry</button>
                            </div> : null
                    )
            }
        </div >
    )

}


