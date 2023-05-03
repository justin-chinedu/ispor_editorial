import { Question } from "../../domain/models/question"

import MarkEmailRead from "@mui/icons-material/MarkEmailRead";
import CheckCircle from "@mui/icons-material/CheckCircle";
import InfoRounded from "@mui/icons-material/InfoRounded";

import tail from "../../assets/bubble_tail.svg";
import tail_answer from "../../assets/bubble_tail_answer.svg";
import { Answer } from "../../domain/models/answer";
import { useShowBottomSheet } from "../bottom_sheet/bottom_sheet";
import { QuestionAnswers } from "../question_answers/question_answers";
import { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { fetchNameFromLocal } from "../../core/utils";
import { ReadMoreText } from "../read_more_text";

export const QuestionAnswerBubble = ({ question_or_answer: qa, answerCount }: { question_or_answer: Question | Answer, answerCount?: number }) => {
    const date = new Date(qa.created_at)
    const verified = qa.verified;
    const isQuestion = "question" in qa;
    const reverse = !isQuestion;
    const [showAllKeywords, setShowAllKeywords] = useState(false);

    const { showBottomSheet, closeBottomSheet, isOpen } = useShowBottomSheet();

    const username = fetchNameFromLocal();
    const keywords = qa.keywords.filter((q) => q.toLocaleLowerCase() !== username?.toLocaleLowerCase());
    useEffect(() => {
        setShowAllKeywords(false)
    }, [isOpen])

    function onQuestionClick() {
        if (isQuestion) {
            showBottomSheet(
                <div className="p-6 h-full">
                    <QuestionAnswers question={qa} />
                </div>
                , { closeOnExternalTap: true });
        }
    }

    function handleOnLinkClicked() {
        if (isOpen) {
            closeBottomSheet();
            setShowAllKeywords(false)
        }
    }

    return (
        <div onClick={onQuestionClick} id={`${isQuestion ? 'question' : 'answer'}-${qa.id}`} className={"flex items-start " + (reverse ? "flex-row-reverse " : "flex-row  ")}>
            {/* Bubble Tail */}
            <img src={isQuestion ? ('.' + tail) : ('.' + tail_answer)} alt="" className={(reverse ? "-rotate-90" : "")} />
            <div className={"w-full h-fit text-sm  py-2 px-4 text-neutral-300 rounded-ee-xl rounded-es-xl " + (reverse ? "rounded-ss-xl bg-teal-900/70" : "rounded-se-xl bg-slate-700/50")}>
                {/* Message Author & Keywords*/}
                <div className={" text-white/60 text-xs mb-3 flex-col"}>
                    <p className="text-primary-color mb-2">{qa.name}</p>
                    {/* Keywords */}
                    {keywords.length > 0 ?
                        <div onClick={(ev) => { ev.stopPropagation() }} className="flex flex-wrap gap-x-2 items-center gap-y-2">
                            {showAllKeywords ? "All keywords:" : "keywords:"}

                            {
                                keywords.slice(0, showAllKeywords ? 10 : 2).map(kw => (
                                    <HashLink onClick={handleOnLinkClicked} to={`/anonymous?kw=${kw}`} key={kw} className={"select-none underline text-white " + (showAllKeywords ? "" : "overflow-hidden text-ellipsis ")}>{kw}</HashLink>
                                ))
                            }
                            {
                                keywords.length <= 2 ? null : <button type="button" onClick={() => setShowAllKeywords(s => !s)} key={"more"} className="select-none underline text-white">{showAllKeywords ? "show less" : `+ ${keywords.length - 2}`}</button>
                            }

                        </div> :
                        null
                    }
                </div>

                {/* Message Text */}
                <ReadMoreText maxLines={3} className="mb-2">{isQuestion ? qa.question : qa.answer}</ReadMoreText>

                {/* Message Info */}
                <div className="flex gap-x-1 justify-end items-center text-white/50 text-xs mb-2 text-right  scale-90">

                    {/* Time */}
                    <span>{date.toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
                    <div className="mx-2 inline w-0.5 h-4 bg-white/40" />
                    {/* Answer Count */}
                    {answerCount ?
                        <>
                            <span className="text-white">{`${answerCount} answer${answerCount > 1 ? "s" : ""}`}</span>
                            <span className="text-white"><MarkEmailRead fontSize="small" /></span>
                            <div className="mx-2 inline w-0.5 h-4 bg-white/40" />
                        </> : null
                    }
                    {/* Verified */}
                    <span className={verified ? "text-emerald-400/80" : "text-red-400/80"}>{verified ? <CheckCircle fontSize="small" /> : <InfoRounded fontSize="small" />}</span>
                    <span className={verified ? "text-emerald-400/80" : "text-red-400/80"}>{verified ? "Verified" : "Not Verified"}</span>
                </div>
            </div>
        </div>
    )
}


export const QABubblePlaceHolder = ({ reverse }: { reverse?: boolean }) => {
    return (
        <div className={"flex items-start " + (reverse ? "flex-row-reverse " : "flex-row  ")}>
            {/* Bubble Tail */}
            <img src={!reverse ? ('.' + tail) : ('.' + tail_answer)} alt="" className={(reverse ? "-rotate-90" : "")} />
            <div className={"w-full h-24 text-sm  py-2 px-4 text-neutral-300 rounded-ee-xl rounded-es-xl " + (reverse ? "rounded-ss-xl bg-teal-900/70" : "rounded-se-xl bg-slate-700/50")}>
            </div>
        </div>
    )
}
