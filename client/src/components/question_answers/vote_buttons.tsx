
import { Question } from "../../domain/models/question";
import { useAppDispatch } from "../../store";
import { voteQuestion } from "./question_answers_slice";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import UploadRounded from "@mui/icons-material/UploadRounded";
import { useQuestionSelector } from "../../hooks/question_hooks";
import { fetchVotedQuestionsFromLocal } from "../../core/utils";

export const VoteButtons = (props: { question: Question }) => {
    const questionState = useQuestionSelector(props.question);
    const dispatch = useAppDispatch();

    const question = questionState?.question ?? props.question;
    const id = question.id!;
    const upvotes = question.upvotes
    const downvotes = question.downvotes;

    function handleVote(upvote: boolean) {
        const saved = fetchVotedQuestionsFromLocal()
        if (upvote) {
            if (saved.downvoted.includes(id)) {
                dispatch(voteQuestion({ question: question ?? question, isUpvote: false }))
                    .then((action) => dispatch(voteQuestion({ question: action.payload as Question, isUpvote: true })));
            } else {
                dispatch(voteQuestion({ question: question ?? question, isUpvote: true }));
            }
        } else {
            if (saved.upvoted.includes(id)) {
                dispatch(voteQuestion({ question: question ?? question, isUpvote: true }))
                    .then((action) => dispatch(voteQuestion({ question: action.payload as Question, isUpvote: false })));
            } else {
                dispatch(voteQuestion({ question: question ?? question, isUpvote: false }));
            }
        }
    }

    return (
        <div className="flex gap-x-2 items-center">
            <button onClick={() => handleVote(true)} type="button" className=" text-emerald-200">
                <UploadRounded fontSize="inherit" /> {upvotes}
            </button>
            <button onClick={() => handleVote(false)} type="button" className=" text-red-200">
                <DownloadRounded fontSize="inherit" /> {downvotes}
            </button>
        </div>
    )
}
