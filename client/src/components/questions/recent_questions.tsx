import { useEffect } from "react";
import { useAppDispatch } from "../../store";
import { QuestionAnswerBubble } from "./question_answer_bubble";
import { fetchRecentQuestions, selectRecentsState } from "./questions_slice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export const RecentQuestions = () => {
    const dispatch = useAppDispatch();
    const recents = useSelector(selectRecentsState);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchRecentQuestions())
    }, [])

    return (
        <>
            {
                recents.state === "idle" && (recents.questions.length > 0) ?
                    <div className="w-full grow max-w-screen-sm">
                        <p className="text-sm text-slate-200 font-normal mb-6">Recently Approved Questions</p>
                        <div className="flex flex-col gap-y-4">
                            {
                                recents.questions.map(q => <QuestionAnswerBubble key={q.id} question_or_answer={q} />)
                            }
                        </div>
                        <div className="flex justify-center">
                            <button type="button" onClick={() => navigate("/anonymous")} className="mx-auto underline text-center mt-4 text-sm text-white/70 font-normal mb-6">See All Questions</button>
                        </div>
                    </div>
                    : null
            }

        </>
    )

}
