import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../store";
import { fetchAllQuestions, selectAllQuestionsState } from "./questions_slice";
import { useSelector } from "react-redux";
import { QuestionAnswerBubble } from "./question_answer_bubble";
import InfoRounded from "@mui/icons-material/InfoRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { useSearchParams } from "react-router-dom";
import { FilterButton } from "../filters/filter_button";
import { FilterFrame } from "../filters/filter_frame";
import { questionFilterSections, sectionsToQuestionFilter } from "../filters/filters";
import { QuestionFilter } from "../../domain/dao/filter";
import { jprint } from "../../core/utils";

export const QuestionsList = () => {
    const dispatch = useAppDispatch();
    const questionsState = useSelector(selectAllQuestionsState);
    const divRef = useRef<HTMLDivElement | null>(null);
    const perPage = 8;
    const [currentRange, setCurrentRange] = useState({ from: 0, to: perPage })
    const [params, setParams] = useSearchParams();
    const keyword = params.get("kw");

    //Filter
    const [filterIsVisible, setFilterIsVisible] = useState(false);
    const [filterSections, setFilterSections] = useState(questionFilterSections);
    const [questionFilter, setQuestionFilter] = useState<QuestionFilter>({ ...sectionsToQuestionFilter(filterSections), range: currentRange, keyword: keyword });

    useEffect(() => {
        dispatch(fetchAllQuestions({ ...questionFilter, range: currentRange, keyword: keyword }));
    }, [currentRange, params])

    const loadingMore = questionsState.state === "processing" && questionsState.data.length > 0 && currentRange.from > 0;

    const handleScroll = (_ev: Event) => {
        const div = divRef.current;
        if (div) {
            const isBottom = div.getBoundingClientRect().bottom < window.innerHeight;
            if (isBottom && questions.length >= currentRange.to) {
                const newRange = { from: currentRange.to, to: (currentRange.to + perPage) };
                setCurrentRange(newRange);
            }
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [questionsState])

    function onFilter(sections: typeof questionFilterSections) {
        const range = { from: 0, to: perPage };
        const filter = { ...sectionsToQuestionFilter(sections), keyword, range: range };
        setQuestionFilter(filter);
        setFilterSections(sections);
        setFilterIsVisible(false);
        setCurrentRange(range);
    }

    const questions = questionsState.data;

    if (questionsState.error) {
        return (
            <div className=" flex flex-col items-center gap-y-4 mt-6">
                <div className="flex items-center mt-56">
                    <span className={"text-red-200/80 mr-2 text-sm"}>{<InfoRounded fontSize="small" />}</span>
                    <span className={"text-red-200/80 text-sm"}>{"Error fetching questions"}</span>
                </div>
                <button onClick={() => dispatch(fetchAllQuestions({ ...questionFilter, range: currentRange, keyword: keyword }))
                } className="bg-red-200/80 hover:bg-red-300/80  text-gray-700 py-2 px-4 rounded-lg text-sm" type="button"> Retry</button>
            </div >
        )
    }

    return (
        <>
            {
                questionsState.state === "success" || loadingMore ?
                    <div ref={divRef} className="w-full grow max-w-screen-sm">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-sm text-slate-200 font-normal">All Questions</p>
                            <FilterButton active={filterIsVisible} onClick={() => setFilterIsVisible(v => !v)} />
                        </div>
                        {filterIsVisible &&
                            <div className="mb-6">
                                <FilterFrame sections={filterSections} onFilter={onFilter} />
                            </div>
                        }
                        {keyword ?
                            <div className=" bg-slate-700/60 rounded-lg w-fit p-2 text-sm text-slate-200 font-normal mb-6">
                                Showing results for : <span className="underline font-medium">{keyword}</span>
                                <CancelRounded onClick={() => setParams()} className="ml-2 text-red-300" fontSize="small" />
                            </div> : null}
                        {/* Questions */}
                        <div className="flex flex-col gap-y-4">
                            {
                                questions.map(q => <QuestionAnswerBubble key={q.id} question_or_answer={q} />)
                            }
                            {loadingMore ?
                                <p className="text-white">Loading More Questions ...</p>
                                : null
                            }
                        </div>
                    </div>
                    : questionsState.state === "processing" ?
                        <p className="text-white">Fetching Questions ...</p>
                        : null
            }

        </>
    )

}
