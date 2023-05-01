import anon_pic from "@assets/anon pic.png"
import anon_text from "@assets/anon text.svg"
import DoubleArrow from "@mui/icons-material/DoubleArrow"
import { AppBar } from "../app_bar"
import { useEffect, useState } from "react"
import { About } from "./about"
import { SITE_PROTOCOL } from "../../core/constants"
import { HashLink as Link } from 'react-router-hash-link';

export const Jumbotron = () => {
    const [aboutIsVisible, setAboutIsVisible] = useState(false);

    return (
        <div>
            <AppBar onToggleOpen={((isOpen) => setAboutIsVisible(isOpen))} />

            <div className="relative h-[280px] sm:h-[420px] bg-gradient-radial  from-white via-primary-color  to-primary-color from-5%">

                <About className={"absolute inset-0 transition-all duration-1000 " + (aboutIsVisible ? "z-10 translate-x-0 opacity-100" : "z-0 -translate-y-1/2 opacity-0")} />

                <div className={"absolute inset-0 flex transition duration-1000 h-full w-full " + (aboutIsVisible ? "z-0 -translate-x-1/2 opacity-0 " : "z-10 translate-x-0 opacity-100")}>
                    {/* Content */}
                    <div className="basis-1/2 flex flex-col gap-y-6 ml-6 md:ml-12 pr-6 sm:items-center justify-center">
                        <img src={'.' + anon_text} alt="Anonymous Consultant Logo" className="w-full h-fit" />
                        <div className="w-fit min-[500px]:self-center">
                            {/* Ask Button */}
                            <AskButton />
                            <TimerText endTime="2023-05-20T06:00:00.000+01:00" />
                        </div>
                    </div>
                    <div className="basis-1/2 relative">
                        <img src={'.' + anon_pic} alt="" className="max-w-[200px] sm:max-w-none h-full object-contain object-bottom absolute md:right-1/3  right-0 bottom-0 " />
                    </div>
                </div>

            </div>


        </div>
    )
}

const TimerText = (props: React.HTMLAttributes<{}> & { endTime?: string }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const interval = 1000; //ms

    useEffect(
        () => {
            const timer = setInterval(() => {
                const currentDate = Date.now();
                const enddate = props.endTime ? Date.parse(props.endTime) : Date.now();
                const diff = enddate - currentDate;

                if (diff >= 0) {
                    setCurrentTime(diff - interval);
                } else if (currentTime !== 0) {
                    setCurrentTime(0);
                }
            }, interval);
            return () => { clearInterval(timer) }
        }, []);

    const date = new Date(currentTime);

    const seconds = date.getUTCSeconds();
    const minutes = date.getUTCMinutes();
    const hours = date.getUTCHours();
    const days = ((currentTime / (3600 * 1000)) / 24);
    const timeExhausted = seconds * minutes * hours * days < 0;
    const timeNotation = (days >= 1) ? `${days.toFixed()} ${days < 2 ? "day" : "days"}` : `${hours}h : ${minutes}m : ${seconds}s`
    const time = timeExhausted ? '0h : 0m : 0s' : timeNotation;

    return (
        <div>
            <p className="mx-auto w-fit mt-2 text-center">
                <span className="font-bold text-lg">{time}</span>
                <span className="text-sm block">left till publication</span>
                <span className="block text-xs font-semibold self-center mt-4">{"Health\u30FBISPOR"}</span>
            </p >
        </div>

    )
}

const AskButton = () => {
    const url = SITE_PROTOCOL + window.location.host;

    return (

        <Link to={"/anonymous"} className="block bg-secondary-color hover:active:bg-secondary-color/70 py-2 px-4 rounded-lg w-fit ">
            <div className="flex items-center gap-x-2 ">
                <p className="text-primary-color font-light text-sm">See Questions</p>
                <DoubleArrow fontSize={"small"} className="text-primary-color text-xs" />
            </div>
        </Link>
    );
}