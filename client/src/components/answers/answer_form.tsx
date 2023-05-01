import Send from "@mui/icons-material/Send";
import RecyclingRounded from "@mui/icons-material/RecyclingRounded";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Person from "@mui/icons-material/Person";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { addAnswer, selectAnswerFormState } from "./answer_form_slice";
import { fetchAnswersForQuestion, saveAnswer } from "../question_answers/question_answers_slice";
import { Question } from "../../domain/models/question";
import { fetchNameFromLocal, generateName as generateRandomName, saveNameToLocal } from "../../core/utils";
import { AnswerFilter } from "../../domain/dao/filter";


export const AnswerForm = (props: { answerFilter: AnswerFilter, question: Question }) => {

    const typedAnswer = useSelector((state: RootState) => {
        if (props.question.id && props.question.id in state.question_answers) {
            return state.question_answers[props.question.id].typed_answer;
        }
        return "";
    });

    const [answer, setAnswer] = useState(typedAnswer);
    type ButtonText = "Answer Anonymously" | "Please Wait ..." | "Sent Successfuly";
    const [buttonText, setbuttonText] = useState<ButtonText>("Answer Anonymously");
    const [username, setUsername] = useState("")

    const formState = useSelector(selectAnswerFormState);

    const dispatch = useAppDispatch();

    useEffect(() => {
        switch (formState.uploadState) {
            case "processing":
                setbuttonText("Please Wait ...");
                break;
            case "error":
            case "idle":
                setbuttonText("Answer Anonymously");
                break;
            case "success":
                setbuttonText("Sent Successfuly");
                break;
        }

    }, [formState.uploadState])

    const handleInput: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        e.preventDefault();
        if (buttonText !== "Answer Anonymously") {
            setbuttonText("Answer Anonymously");
        }
        const answer = e.target?.value ?? ""
        setAnswer(answer);
        dispatch(saveAnswer({ question: props.question, answer: answer }));
    }


    const handleSubmit = () => {
        dispatch(addAnswer({
            created_at: new Date().toISOString(),
            answer: answer.trim(),
            name: username,
            keywords: [],
            question_id: props.question.id!
        })).then(
            () => dispatch(fetchAnswersForQuestion(props.answerFilter))
        );
    }



    const disabled = answer.trim().length < 1 || username.trim().length < 1 || formState.uploadState == "processing";

    return (
        <div className="w-full pb-8">
            <form className="w-full flex flex-col gap-y-4 " action="">
                <textarea value={answer} onChange={handleInput} className="min-h-[8rem] max-h-32 h-24 bg-gray-700/60 appearance-none border border-transparent focus:border-primary-color/50 rounded-lg w-full py-4 px-4 text-primary-color placeholder:text-white/70 leading-tight focus:outline-none focus:shadow-outline text-sm" placeholder="My Answer Is ..." name="Question" id="input-answer" />
                <label title="Username" className="text-xs font-light text-white/90">{"Your Anonymous Name"}</label>
                <UsernameInput key={"name_input"} onChange={name => setUsername(name)} />

                {disabled ? null : <p className="text-xs font-light text-white/90">Note : Answers would be screened before approval</p>}
                <button disabled={disabled} type="button" onClick={handleSubmit} className={`${formState.uploadState === "success" && buttonText != "Answer Anonymously" ? "bg-emerald-500" : "bg-slate-700/40"} py-2 px-4 rounded-lg ${disabled ? "opacity-60" : "hover:active:bg-slate-700"}`}>
                    <div className={`flex items-center gap-x-2 justify-center ${formState.uploadState === "success" ? "text-white" : "text-primary-color"}`}>
                        <p className="text-sm">{buttonText}</p>
                        {formState.uploadState == "processing"
                            ? <RecyclingRounded className="animate-spin" />
                            : (formState.uploadState === "success") && buttonText != "Answer Anonymously" ? <CheckCircle /> : <Send />
                        }
                    </div>
                </button>
                {
                    formState.error ?
                        <p className="mt-2 w-full opacity-90 text-center rounded-lg text-xs text-rose-800 p-2 bg-rose-200">Unable to send answer. Please Resend</p>
                        : null
                }
            </form>
        </div>

    )
}


export const UsernameInput = (props: { onChange: (name: string) => void }) => {

    const [savedName, setSavedName] = useState(fetchNameFromLocal());
    const [username, setUsername] = useState("")
    const [nameIsSaved, setNameIsSaved] = useState(fetchNameFromLocal() === username);

    useEffect(() => {
        const name = savedName !== null ? savedName : generateRandomName();
        setUsername(name);
        setNameIsSaved(name === fetchNameFromLocal());
    }, [savedName])


    useEffect(() => {
        const name = fetchNameFromLocal()
        if (savedName !== name) {
            setSavedName(name)
        }
    })

    useEffect(() => {
        props.onChange(username);
    }, [username])

    function generateName() {
        const name = generateRandomName();
        setUsername(name);
        setNameIsSaved(name === fetchNameFromLocal());
    }

    const handleUsernameInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        const name = e.target?.value ?? "";
        setUsername(name);
        setNameIsSaved(name === fetchNameFromLocal());
    }

    function saveName(name: string) {
        saveNameToLocal(name);
        setNameIsSaved(true);
        setUsername(name);
    }

    return (
        < div className="flex gap-x-3 items-center" >
            <Person className="text-white" />
            <input onChange={handleUsernameInput} value={username} className="min-w-[28px] bg-gray-700/60 appearance-none border border-transparent focus:border-primary-color/50 rounded-lg w-full py-3 px-2 text-primary-color placeholder:text-white/70 leading-tight focus:outline-none focus:shadow-outline text-xs" placeholder="Your Anonymous name" type="text" name="User Name" id="username" title="User name" />
            < div className="flex gap-x-1.5 items-center" >
                <button onClick={() => generateName()} type="button" className="bg-emerald-600 hover:active:bg-emerald-700 text-white rounded-lg py-2 px-4">
                    <p className="text-xs">Generate</p>
                </button>

                <button disabled={nameIsSaved} onClick={() => saveName(username.trim())} type="button" className={"text-white rounded-lg py-2 px-4 " + (nameIsSaved ? " bg-slate-700" : "bg-emerald-600 hover:active:bg-emerald-700")}>
                    <p className="text-xs">{nameIsSaved ? "Saved" : "Save"}</p>
                </button>
            </div>
        </div >
    )
}
