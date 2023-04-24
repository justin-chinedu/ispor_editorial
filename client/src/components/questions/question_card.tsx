import { Question } from "../../domain/models/question"

import MarkEmailRead from "@mui/icons-material/MarkEmailRead";
import CheckCircle from "@mui/icons-material/CheckCircle";
import InfoRounded from "@mui/icons-material/InfoRounded";

import tail from "../../assets/bubble_tail.svg";
export const QuestionCard = (props: { question: Question }) => {
    const date = new Date(props.question.created_at)
    const verified = props.question.verified;

    return (
        <div className="flex items-start">
            {/* <BubbleTail/> */}
            <img src={tail} alt="" className="fill-white" />
            <div className="w-full max-h-44 text-sm bg-slate-700/50 rounded-ee-xl rounded-es-xl rounded-se-xl  py-2 px-4 text-neutral-300">
                <p className="text-white/60 text-xs mb-3">
                    <span></span>
                    <span>By Anonymous</span>
                </p>
                <p className="w-full text-sm text-ellipsis overflow-hidden line-clamp-2 mb-3">{props.question?.question}</p>
                <div className="flex gap-x-1 justify-end items-center text-white/50 text-xs mb-2 text-right  scale-90">
                    <span>{date.toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
                    <span><MarkEmailRead fontSize="small" /></span>
                    <div className="mx-2 inline w-0.5 h-4 bg-white/40" />
                    <span className={verified ? "text-emerald-400/80":"text-red-400/80"}>{verified ? <CheckCircle fontSize="small" /> : <InfoRounded fontSize="small" />}</span>
                    <span className={verified ? "text-emerald-400/80":"text-red-400/80"}>{verified ? "Verified" : "Not Verified"}</span>
                </div>
            </div>
        </div>


    )
}

const BubbleTail = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 56 56">
            <path
                width={"56px"}
                height={"56px"}
                d="m 22.500001,164.99998 h 18 v 18 z"
                fill="white"
            />
        </svg>
    );
};