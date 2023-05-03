import Menu from "@mui/icons-material/Menu"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useShowBottomSheet } from "./bottom_sheet/bottom_sheet";
import { AuthForm } from "./auth/auth_forms";
import authApi, { useGetUser, useSignout } from "./auth/auth_api";
import { useAppDispatch } from "../store";

export const AppBar = (props: { onToggleOpen?: (isOpen: boolean) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const authState = useGetUser()
    const [signOut, _] = useSignout()
    const dispatch = useAppDispatch();
    const { isOpen: isBottomOpen, showBottomSheet } = useShowBottomSheet();
    
    function handleAuth() {
        if (!isBottomOpen) {
            showBottomSheet(<AuthForm />, { closeOnExternalTap: true })
        }
    }

    function handleSignOut() {
        signOut();
    }

    useEffect(() => {
        if (props.onToggleOpen) {
            props.onToggleOpen(isOpen);
        }
    }, [isOpen])

    function toggleOpen() {
        setIsOpen(s => !s);
    }
    const user = authState.data;

    return (
        <div className="z-30 h-14 bg-primary-color flex items-center sticky top-0 sm:relative">
            <div onClick={toggleOpen} className={"sm:hidden mx-4 hover:active:bg-gray-500/20 rounded-full p-1 transition-all duration-1000 " + (isOpen ? "rotate-90" : "rotate-0")}>
                <Menu fontSize="medium" className="" />
            </div>
            <p onClick={() => navigate('/')} className="sm:pl-6">
                <span className="text-xl font-bold">ISPOR </span>
                <span className="text-xl">UNN</span>
            </p>
            <div className="grow flex justify-end gap-x-4 mr-6 items-center">
                <button onClick={toggleOpen} type="button" className="text-xs font-semibold hidden sm:block hover:active:underline">{isOpen ? "Home" : "About"}</button>
                {
                    user == null || user == undefined ?
                        <button onClick={handleAuth} type="button" className="text-[10px] font-semibold text-center bg-white/40 hover:active:bg-white/50 text-secondary-color border border-secondary-color/20 p-1 rounded">Sign Up or Login</button>
                        :
                        <div className="flex gap-x-2 items-center">
                            <button onClick={handleSignOut} type="button" className="text-[10px] font-semibold text-center bg-white/40 hover:active:bg-white/50 text-secondary-color border border-secondary-color/20 py-1 px-2 rounded">Sign Out</button>
                        </div>
                }
            </div>
            {/* <div className="hidden sm:flex grow justify-end pr-16">
                <button onClick={toggleOpen} type="button" className="hover:active:underline">{isOpen ? "Home" : "About"}</button>
            </div> */}
        </div>
    )
}