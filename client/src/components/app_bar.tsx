import Menu from "@mui/icons-material/Menu"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const AppBar = (props: { onToggleOpen?: (isOpen: boolean) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.onToggleOpen) {
            props.onToggleOpen(isOpen);
        }
    }, [isOpen])

    function toggleOpen() {
        setIsOpen(s => !s);
    }

    return (
        <div className="z-30 h-14 bg-primary-color flex items-center sticky top-0 sm:relative">
            <div onClick={toggleOpen} className={"sm:hidden mx-4 hover:bg-gray-500/20 rounded-full p-1 transition-all duration-1000 " + (isOpen ? "rotate-90" : "rotate-0")}>
                <Menu fontSize="medium" className="" />
            </div>
            <p onClick={() => navigate('/')} className="sm:pl-6">
                <span className="text-xl font-bold">ISPOR </span>
                <span className="text-xl">Editorial</span>
            </p>
            <div className="hidden sm:flex grow justify-end pr-16">
                <button onClick={toggleOpen} type="button" className="hover:underline">{isOpen ? "Home" : "About"}</button>
            </div>
        </div>
    )
}