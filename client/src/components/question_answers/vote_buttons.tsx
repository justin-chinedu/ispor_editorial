
import { Question } from "../../domain/models/question";
import { useAppDispatch } from "../../store";
import { voteAnswer, voteQuestion } from "./question_answers_slice";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import UploadRounded from "@mui/icons-material/UploadRounded";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import { useQuestionSelector } from "../../hooks/question_hooks";
import { useGetUser, useUpdateUser } from "../auth/auth_api";
import { VoteData } from "../../domain/models/user/user_meta";
import { useShowBottomSheet } from "../bottom_sheet/bottom_sheet";
import { AuthForm } from "../auth/auth_forms";
import { Answer } from "../../domain/models/answer";
import { jprint } from "../../core/utils";
import { UserMetadata } from "@supabase/supabase-js";

export const VoteButtons = (props: { question: Question }) => {
    const questionState = useQuestionSelector(props.question);
    const dispatch = useAppDispatch();
    const userState = useGetUser();
    const { showBottomSheet } = useShowBottomSheet();
    const [updateUser, _] = useUpdateUser();

    function handleAuth() {
        showBottomSheet(<AuthForm />, { closeOnExternalTap: true })
    }

    const user = userState.data;
    const meta: UserMetadata | undefined = userState.data?.user_metadata;
    const answerVotes: VoteData = meta?.answer_votes ?? { upvoted: [], downvoted: [] };
    const questionVotes: VoteData = meta?.question_votes ?? { upvoted: [], downvoted: [] };

    const question = questionState?.question ?? props.question;
    const id = question.id!;
    const upvotes = question.upvotes
    const downvotes = question.downvotes;

    function handleVote(upvote: boolean) {
        if (!user) {
            handleAuth();
            return;
        }

        let upvoted = questionVotes.upvoted;
        let downvoted = questionVotes.downvoted;

        if (upvote) {
            if (questionVotes.downvoted.includes(id)) {
                dispatch(voteQuestion({ question: question, isUpvote: false, votes: questionVotes }))
                    .then((action) => dispatch(voteQuestion({ question: action.payload as Question, isUpvote: true, votes: questionVotes })));
                downvoted = questionVotes.downvoted.filter(x => x !== id);
            } else {
                dispatch(voteQuestion({ question: question, isUpvote: true, votes: questionVotes }));
            }
            upvoted = questionVotes.upvoted.includes(id) ? questionVotes.upvoted.filter(x => x !== id) : [...questionVotes.upvoted, id];
        } else {
            if (questionVotes.upvoted.includes(id)) {
                dispatch(voteQuestion({ question: question, isUpvote: true, votes: questionVotes }))
                    .then((action) => dispatch(voteQuestion({ question: action.payload as Question, isUpvote: false, votes: questionVotes })));
                upvoted = questionVotes.upvoted.filter(x => x !== id);
            } else {
                dispatch(voteQuestion({ question: question, isUpvote: false, votes: questionVotes }));
            }
            downvoted = questionVotes.downvoted.includes(id) ? questionVotes.downvoted.filter(x => x !== id) : [...questionVotes.downvoted, id];
        }
        updateUser({ ...meta, question_votes: { downvoted: downvoted, upvoted: upvoted }, answer_votes: answerVotes })
    }

    return (
        <div className="flex gap-x-2 items-center">
            <button onClick={() => handleVote(true)} type="button" className=" text-white">
                <UploadRounded fontSize="inherit" /> {upvotes}
            </button>
            <button onClick={() => handleVote(false)} type="button" className=" text-white">
                <DownloadRounded fontSize="inherit" /> {downvotes}
            </button>
        </div>
    )
}

export const VoteAnswerButtons = ({ answer, question }: { answer: Answer, question: Question }) => {
    const dispatch = useAppDispatch();
    const userState = useGetUser();
    const { isOpen, showBottomSheet } = useShowBottomSheet();
    const [updateUser, _] = useUpdateUser();

    const questionState = useQuestionSelector(question);
    const stateAnswer = questionState?.answers_state.data.filter(x => x.id == answer.id)[0];
    answer = stateAnswer ?? answer;

    function handleAuth() {
        showBottomSheet(<AuthForm />, { closeOnExternalTap: true })
    }

    const user = userState.data;
    const meta: any | undefined = userState.data?.user_metadata;
    const answerVotes: VoteData = meta?.answer_votes ?? { upvoted: [], downvoted: [] };
    const questionVotes: VoteData = meta?.question_votes ?? { upvoted: [], downvoted: [] };

    const id = answer.id!;
    const upvotes = answer.upvotes
    const downvotes = answer.downvotes;

    function handleVote(upvote: boolean) {
        if (user == undefined) {
            handleAuth();
            return;
        }

        let upvoted = answerVotes.upvoted;
        let downvoted = answerVotes.downvoted;

        if (upvote) {
            if (answerVotes.downvoted.includes(id)) {
                dispatch(voteAnswer({ answer: answer, isUpvote: false, votes: answerVotes }))
                    .then((action) => dispatch(voteAnswer({ answer: action.payload as Answer, isUpvote: true, votes: answerVotes })));
                downvoted = answerVotes.downvoted.filter(x => x !== id);
            } else {
                dispatch(voteAnswer({ answer: answer, isUpvote: true, votes: answerVotes }));
            }
            upvoted = answerVotes.upvoted.includes(id) ? answerVotes.upvoted.filter(x => x !== id) : [...answerVotes.upvoted, id];
        } else {
            if (answerVotes.upvoted.includes(id)) {
                dispatch(voteAnswer({ answer: answer, isUpvote: true, votes: answerVotes }))
                    .then((action) => dispatch(voteAnswer({ answer: action.payload as Answer, isUpvote: false, votes: answerVotes })));
                upvoted = answerVotes.upvoted.filter(x => x !== id);
            } else {
                dispatch(voteAnswer({ answer: answer, isUpvote: false, votes: answerVotes }));
            }
            downvoted = answerVotes.downvoted.includes(id) ? answerVotes.downvoted.filter(x => x !== id) : [...answerVotes.downvoted, id];
        }
        updateUser({ ...meta, answer_votes: { downvoted: downvoted, upvoted: upvoted }, question_votes: questionVotes })
    }

    return (
        <div className="flex flex-col gap-y-2 items-center">
            <button onClick={() => handleVote(true)} type="button" className="flex gap-x-1 items-center text-white">
                <ArrowUpward fontSize="inherit" /> <p className="text-white text-sm">{upvotes}</p>
            </button>
            <button onClick={() => handleVote(false)} type="button" className="flex gap-x-1 items-center text-white">
                <ArrowDownward fontSize="inherit" /> <p className="text-white text-sm">{downvotes}</p>
            </button>
        </div>
    )
}
