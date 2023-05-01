import Send from "@mui/icons-material/Send";
import RecyclingRounded from "@mui/icons-material/RecyclingRounded";
import CheckCircle from "@mui/icons-material/CheckCircle";

import { useEffect, useState } from "react";
import { addQuestion, fetchAllQuestions, fetchCount, fetchRecentQuestions, selectQuestionUploadState, selectQuestionsFilter } from "./questions_slice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import { UsernameInput } from "../answers/answer_form";
import { ForumSectionsForm } from "../forum_section/section_frame";

export const QuestionForm = () => {

    const [question, setQuestion] = useState("");
    type ButtonText = "Ask Anonymously" | "Please Wait ..." | "Sent Successfuly";
    const [buttonText, setbuttonText] = useState<ButtonText>("Ask Anonymously");
    const [username, setUsername] = useState("");
    const [sectionIds, setSectionIds] = useState<number[]>([]);

    const uploadState = useSelector(selectQuestionUploadState);
    const dispatch = useAppDispatch();


    useEffect(() => {
        switch (uploadState.state) {
            case "processing":
                setbuttonText("Please Wait ...");
                break;
            case "error":
            case "idle":
                setbuttonText("Ask Anonymously");
                break;
            case "success":
                setbuttonText("Sent Successfuly");
                break;
        }

        if (uploadState.state == "success") {
            dispatch(fetchCount());
            dispatch(fetchRecentQuestions());
        }
    }, [uploadState.state])

    const handleInput: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        e.preventDefault();

        if (buttonText !== "Ask Anonymously") {
            setbuttonText("Ask Anonymously");
        }

        setQuestion(e.target?.value?.trim() ?? "");
    }

    const handleSubmit = () => {
        dispatch(addQuestion({
            created_at: new Date().toISOString(),
            question: question,
            name: username,
            keywords: [],
            section_id: [...sectionIds].pop(),
            upvotes: 0,
            downvotes: 0
        })).then(
            () => dispatch(fetchAllQuestions())
        );
    }

    const disabled = question.trim().length < 1 || username.trim().length < 1 || uploadState.state == "processing" || sectionIds.length == 0;



    return (
        <div className="w-full">
            <form className="w-full flex flex-col gap-y-4" action="">
                <textarea onChange={handleInput} className=" h-40 bg-neutral-700/20 appearance-none border border-transparent focus:border-primary-color/50 rounded-lg w-full py-4 px-4 text-primary-color placeholder:text-primary-color/50 leading-tight focus:outline-none focus:shadow-outline text-sm" placeholder="My Question Is ..." name="Question" id="input-question" />
                <ForumSectionsForm onChange={(section_ids) => setSectionIds(section_ids)} />
                <label title="Username" className="text-xs font-light text-white/90">{"Your Anonymous Name"}</label>
                <UsernameInput key={"name_input"} onChange={name => setUsername(name)} />
                {disabled ? null : <p className="text-xs font-light text-white/90">Questions would be screened before approval</p>}
                <button disabled={disabled} type="button" onClick={handleSubmit} className={`${uploadState.state === "success" && buttonText != "Ask Anonymously" ? "bg-emerald-500" : "bg-neutral-700/40"} py-2 px-4 rounded-lg ${disabled ? "opacity-60" : "hover:active:bg-gray-700"}`}>
                    <div className={`flex items-center gap-x-2 justify-center ${uploadState.state === "success" ? "text-white" : "text-primary-color"}`}>
                        <p >{buttonText}</p>
                        {uploadState.state === "processing"
                            ? <RecyclingRounded className="animate-spin" />
                            : (uploadState.state === "success") && buttonText != "Ask Anonymously" ? <CheckCircle /> : <Send />
                        }
                    </div>
                </button>
                {
                    uploadState.error ?
                        <p className="mt-2 w-full opacity-90 text-center rounded-lg text-xs text-rose-800 p-2 bg-rose-200">Unable to send question. Please Resend</p>
                        : null
                }
            </form>
        </div>

    )
}