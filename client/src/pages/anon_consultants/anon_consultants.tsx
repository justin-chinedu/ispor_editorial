import anon_text from "@assets/anon text.svg"
import { QuestionsList } from "../../components/questions/questions_list"
import { AppBar } from "../../components/app_bar"
import { useShowBottomSheet } from "../../components/bottom_sheet/bottom_sheet"
import { useEffect, useState } from "react"
import { SearchBar } from "../../components/search_bar"
import { useSearchParams } from "react-router-dom"
import ispor_logo from "../../assets/ispor logo.svg";
import unn_logo from "../../assets/unn logo.png";
import { HashLink as Link } from 'react-router-hash-link';
import MessageRounded from "@mui/icons-material/MessageRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { QuestionForm } from "../../components/questions/question_form"
import { ForumSectionFrame } from "../../components/forum_section/section_frame"


export const AnonConsultantsPage = () => {
    const { isOpen, closeBottomSheet } = useShowBottomSheet();
    const [params, setParams] = useSearchParams()
    const [aboutOpen, setAboutOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            closeBottomSheet()
        }
    }, [])


    return (
        <div className="relative">
            <AppBar onToggleOpen={(isOpen) => { setAboutOpen(isOpen) }} />
            {/* About For Anonymous */}
            <div className={"bg-gradient-to-b from-gray-800 to-neutral-800 fixed h-screen flex flex-col items-center gap-y-4 px-4 transition-all duration-700 " + (aboutOpen ? "z-20 translate-y-0" : "opacity-0 z-0 -translate-y-[100%]")}>
                <img src={'.' + ispor_logo} alt="" className="invert mt-6 w-28 object-scale-down" />
                <p className="text-xs text-center text-white">The Professional Society For Health Economics And Outcomes Research, University Of Nigeria</p>
                <p className="text-sm font-semibold text-center text-white mb-6">The Editorial Team, UNN </p>
                <div className="flex gap-x-2">
                    <Link to={"/"} key={"home"} className="text-sm font-semibold text-center bg-white/10 hover:active:bg-white/50 text-white border border-secondary-color/20 p-1 rounded">Home</Link>
                </div>
                <img src={'.' + unn_logo} alt="" className="w-12 object-scale-down" />
            </div>

            <main id="anon_main" className="relative flex flex-col gap-y-6 bg-gradient-to-b from-gray-800 to-neutral-800 h-full min-h-screen">
                <section className=" z-10 sticky -top-12 sm:-top-52 flex flex-col gap-y-6 bg-primary-color p-4">
                    <img src={'.' + anon_text} alt="Anonymous Consultant Logo" className="w-1/2 h-fit mt-6" />
                    <SearchBar searchText={params.get("kw") ?? ""} onSearchSubmit={(s) => setParams((prev) => { prev.set("kw", s); return prev; })} />
                </section>
                <section >
                    <div className="p-4 flex flex-col gap-y-4">
                        <ForumSectionFrame/>
                        <QuestionsList />
                    </div>
                    <QuestionFormFloat />
                </section>

            </main>
        </div>
    )
}

const QuestionFormFloat = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={(isOpen ? "z-40 rounded-lg bg-gray-800 border border-white/50" : "hover:rounded-md bg-slate-500") + " overflow-clip flex flex-col m-4 mb-6 gap-y-4 group transition-all duration-300 rounded-full right-0 bottom-12 fixed p-4"} onClick={isOpen ? undefined : () => setIsOpen(!isOpen)}>
            <div className="flex justify-between">
                {isOpen && <h1 className="text-sm text-white">Ask a question</h1>}
                <button title={isOpen ? "Close" : "Ask Question"} onClick={() => setIsOpen(!isOpen)} type="button" className="text-sm flex gap-x-2 items-center  text-white">
                    {isOpen ?
                        <CancelRounded fontSize="medium" /> :
                        <MessageRounded fontSize="medium" />
                    }
                    <span id="mtext" className={(isOpen ? "block" : "hidden") + " group-hover:block overflow-clip"}>{isOpen ? "Close" : "Ask Question"}</span>
                </button>
            </div>

            <div className={(isOpen ? "w-[100%] block opacity-100" : "hidden opacity-0") + " transition-all duration-300 pb-4"}>
                <QuestionForm />
            </div>
        </div>
    )
}