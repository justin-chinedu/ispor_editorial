import { useEffect } from "react";
import { useSelector } from "react-redux"
import { fetchCount, selectQuestionsCount } from "./questions_slice";
import { useAppDispatch } from "../../store";

export const QuestionsCount = () => {
    const dispatch = useAppDispatch();
    const count = useSelector(selectQuestionsCount);

    useEffect(() => {
        dispatch(fetchCount())
    }, [])

    return (
        <div>
            <p className="text-sm text-white/70 font-light mb-4">An inititative to promote problem-sharing, and educate ISPORites on common and rare issues faced by students</p>
            <hr className="my-4 opacity-20" />
            <p className="text-4xl text-primary-color font-bold">{`${count}+ Questions`}</p>
            <p className="text-2xl text-white font-normal">asked so far</p>
        </div>
    )
}