import CheckCircle from "@mui/icons-material/CheckCircle";
import RecyclingRounded from "@mui/icons-material/RecyclingRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import { useEffect, useState } from "react";
import logo from "../../assets/ispor logo.svg";
import authApi, { useGetUser, useLogin, useSignUp as useSignUp, useSignout as useSignOut } from "./auth_api";
import { useShowBottomSheet } from "../bottom_sheet/bottom_sheet";
import { jprint } from "../../core/utils";
import { useAppDispatch } from "../../store";
import { User } from "@supabase/supabase-js";

export const AuthForm = () => {
    const userState = useGetUser();
    const [shouldLogin, setShouldLogin] = useState(true);
    const { closeBottomSheet } = useShowBottomSheet();


    if (userState.data) {
        return <SignOutFrame user={userState.data} />
    }

    return (
        <section className="flex h- flex-col gap-y-4 justify-center my-6">
            <img className="invert h-6" src={"." + logo} alt="" />
            <div className="flex overflow-clip p-6">
                <div className={"p-6 rounded-lg bg-slate-700/20 min-w-full flex flex-col gap-6 transition-all duration-700 " + (shouldLogin ? "opacity-100" : "-translate-x-full opacity-0")}>
                    <LoginForm />
                    <button onClick={() => setShouldLogin(false)} className="w-fit text-white underline text-sm" type="button">Create An Account</button>
                </div>
                <div className={"p-6 rounded-lg bg-slate-700/20 min-w-full flex flex-col gap-6 transition-all duration-700 " + (shouldLogin ? "opacity-0" : "-translate-x-full opacity-100")}>
                    <SignUpForm />
                    <button onClick={() => setShouldLogin(true)} className="w-fit text-white underline text-sm" type="button">Have An Account Already?</button>
                </div>
            </div>

        </section>
    )
}

export const LoginForm = () => {
    const [login, loginState] = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const dispatch = useAppDispatch();

    type ButtonText = "Login" | "Please Wait ..." | "Login Successfuly";
    const [buttonText, setbuttonText] = useState<ButtonText>("Login");

    function handleLogin(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        login({ email: email.trim(), password: password.trim() });
    }

    const handleEmailInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        const email = e.target?.value ?? "";
        setEmail(email);
    }

    const handlePasswordInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        const pw = e.target?.value ?? "";
        setPassword(pw);
    }

    const disabled = email.trim().length == 0 || password.trim().length == 0;

    return (
        <form className="h-fit flex flex-col gap-y-4">
            <p className="font-semibold text-2xl text-primary-color">Login</p>
            <label htmlFor="lg-email" title="Email" className="text-xs font-light text-white/90">{"Email"}</label>
            <input onChange={handleEmailInput} className="autofill:bg-gray-700/60 min-w-[28px] bg-gray-700/60 appearance-none border border-transparent focus:border-primary-color/50 rounded-lg w-full py-3 px-2 text-primary-color placeholder:text-white/70 leading-tight focus:outline-none focus:shadow-outline text-xs" placeholder="Your Email" type="text" name="Email" id="lg-email" title="Email" />
            <label htmlFor="lg-password" title="Password" className="text-xs font-light text-white/90">{"Password"}</label>
            <input onChange={handlePasswordInput} className="min-w-[28px] bg-gray-700/60 appearance-none border border-transparent focus:border-primary-color/50 rounded-lg w-full py-3 px-2 text-primary-color placeholder:text-white/70 leading-tight focus:outline-none focus:shadow-outline text-xs" placeholder="Your Password" type="password" name="Password" id="lg-password" title="Password" />
            <button disabled={disabled} type="button" onClick={handleLogin} className={`${loginState.isSuccess && buttonText != "Login" ? "bg-emerald-500" : "bg-slate-700/40"} py-2 px-4 rounded-lg ${disabled ? "opacity-60" : "hover:active:bg-slate-700"}`}>
                <div className={`flex items-center gap-x-2 justify-center ${loginState.isSuccess ? "text-white" : "text-primary-color"}`}>
                    <p className="text-sm">{buttonText}</p>
                    {loginState.isLoading
                        ? <RecyclingRounded className="animate-spin" />
                        : (loginState.isSuccess) && buttonText != "Login" ? <CheckCircle /> : null
                    }
                </div>
            </button>
            {
                loginState.error &&
                <p className="mt-2 w-full opacity-90 text-center rounded-lg text-xs text-rose-800 p-2 bg-rose-200">{"Check Username or Password or Connectivty"}</p>

            }
        </form>
    )
}


export const SignUpForm = () => {
    const [signUp, signUpState] = useSignUp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const dispatch = useAppDispatch();

    type ButtonText = "Sign Up" | "Please Wait ..." | "Signed Up Successfully";
    const [buttonText, setbuttonText] = useState<ButtonText>("Sign Up");

    function handleSignUp(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        signUp({ email: email.trim(), password: password.trim() });
    }

    const handleEmailInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        const email = e.target?.value ?? "";
        setEmail(email);
    }

    const handlePasswordInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        const pw = e.target?.value ?? "";
        setPassword(pw);
    }

    const disabled = email.trim().length == 0 || password.trim().length == 0;

    return (
        <form className="flex flex-col gap-y-4 mb-4">
            <p className="font-semibold text-2xl text-primary-color">Sign Up</p>
            <label htmlFor="su-email" title="Email" className="text-xs font-light text-white/90">{"Email"}</label>
            <input onChange={handleEmailInput} className="min-w-[28px] bg-gray-700/60 appearance-none border border-transparent focus:border-primary-color/50 rounded-lg w-full py-3 px-2 text-primary-color placeholder:text-white/70 leading-tight focus:outline-none focus:shadow-outline text-xs" placeholder="Your Email" type="text" name="Email" id="su-email" title="Email" />
            <label htmlFor="su-password" title="Password" className="text-xs font-light text-white/90">{"Password"}</label>
            <input onChange={handlePasswordInput} className="min-w-[28px] bg-gray-700/60 appearance-none border border-transparent focus:border-primary-color/50 rounded-lg w-full py-3 px-2 text-primary-color placeholder:text-white/70 leading-tight focus:outline-none focus:shadow-outline text-xs" placeholder="Your Password" type="password" name="Password" id="su-password" title="Password" />
            <button disabled={disabled} type="button" onClick={handleSignUp} className={`${signUpState.isSuccess && buttonText != "Sign Up" ? "bg-emerald-500" : "bg-slate-700/40"} py-2 px-4 rounded-lg ${disabled ? "opacity-60" : "hover:active:bg-slate-700"}`}>
                <div className={`flex items-center gap-x-2 justify-center ${signUpState.isSuccess ? "text-white" : "text-primary-color"}`}>
                    <p className="text-sm">{buttonText}</p>
                    {signUpState.isLoading
                        ? <RecyclingRounded className="animate-spin" />
                        : (signUpState.isSuccess) && buttonText != "Sign Up" ? <CheckCircle /> : null
                    }
                </div>
            </button>
            {
                signUpState.error &&
                <p className="mt-2 w-full opacity-90 text-center rounded-lg text-xs text-rose-800 p-2 bg-rose-200">{"Check Username or Password or Connectivty"}</p>
            }
        </form>
    )
}


const SignOutFrame = ({ user }: { user: User }) => {

    const { isOpen, closeBottomSheet } = useShowBottomSheet();


    useEffect(() => {
        setTimeout(() => {
            if (isOpen) {
                closeBottomSheet()
            }
        }, 300);
    }, [])


    return (
        <section className="flex text-6xl items-center flex-col p-12 gap-y-6 text-emerald-500">
            <img className="invert h-6" src={"." + logo} alt="" />
            <p className="text-2xl font-bold">Login Successful</p>
            <CheckCircleRounded fontSize="inherit" />
        </section>
    )
}