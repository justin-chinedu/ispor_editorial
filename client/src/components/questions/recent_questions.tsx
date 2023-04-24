import { useEffect } from "react";
import { Question } from "../../domain/models/question";
import { useAppDispatch } from "../../store";
import { QuestionCard } from "./question_card";
import { fetchRecentQuestions, selectRecentsState } from "./questions_slice";
import { useSelector } from "react-redux";

export const RecentQuestions = () => {
    const dispatch = useAppDispatch();
    const recents = useSelector(selectRecentsState);

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
                                recents.questions.map(q => <QuestionCard key={q.question} question={q} />)
                            }
                        </div>
                        <p className=" mt-4 text-sm text-white/50 font-normal mb-6">+ many more</p>
                    </div>
                    : null
            }

        </>
    )

}
