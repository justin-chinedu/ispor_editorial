import anon_text from "@assets/anon text light.svg"
import { QuestionsList } from "../../components/questions/questions_list"
import { AppBar } from "../../components/app_bar"
import { jprint } from "../../core/utils"
import { useShowBottomSheet } from "../../components/bottom_sheet/bottom_sheet"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useNavigation, useParams } from "react-router"
import { SearchBar } from "../../components/search_bar"
import { useSearchParams } from "react-router-dom"
import ispor_logo from "../../assets/ispor logo.svg";
import unn_logo from "../../assets/unn logo.png";
import { HashLink as Link } from 'react-router-hash-link';

export const AnonConsultantsPage = () => {
    const { isOpen, closeBottomSheet } = useShowBottomSheet();
    const [params, setParams] = useSearchParams()
    const [aboutOpen, setAboutOpen] = useState(false);
    const [questionFilterOpen, setQuestionFilterOpen] = useState(false);


    useEffect(() => {
        if (isOpen) {
            closeBottomSheet()
        }
    }, [])


    return (
        <div  className="relative">
            <AppBar onToggleOpen={(isOpen) => { setAboutOpen(isOpen) }} />

            <div className={"bg-gradient-to-b to-gray-800 from-neutral-800 absolute h-full flex flex-col items-center gap-y-4 px-4 transition-all duration-700 " + (aboutOpen ? "z-20 translate-y-0" : "opacity-0 z-0 -translate-y-[100%]")}>
                <img src={'.' + ispor_logo} alt="" className="invert mt-6 w-28 object-scale-down" />
                <p className="text-xs text-center text-white">The Professional Society For Health Economics And Outcomes Research, University Of Nigeria</p>
                <p className="text-sm font-semibold text-center text-white mb-6">The Editorial Team, UNN </p>
                <div className="flex gap-x-2">
                    <Link to={"/"} key={"home"} className="text-sm font-semibold text-center bg-white/10 hover:bg-white/50 text-white border border-secondary-color/20 p-1 rounded">Home</Link>
                </div>
                <img src={'.' + unn_logo} alt="" className="w-12 object-scale-down" />
            </div>

            <main id="anon_main" className="relative flex flex-col gap-y-6 bg-gradient-to-b to-gray-800 from-neutral-800 h-full min-h-screen p-4">

                <img src={'.' + anon_text} alt="Anonymous Consultant Logo" className="w-1/2 h-fit mt-6" />
                <SearchBar searchText={params.get("kw") ?? ""} onSearchSubmit={(s) => setParams((prev) => { prev.set("kw", s); return prev; })} />
                <QuestionsList />
            </main>
        </div>
    )
}