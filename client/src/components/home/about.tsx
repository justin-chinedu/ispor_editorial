import ispor_logo from "../../assets/ispor logo.svg";
import unn_logo from "../../assets/unn logo.png";
import { SITE_PROTOCOL } from "../../core/constants";
import { allBookSections } from "../../domain/models/book_sections";
export const About = (props: React.BaseHTMLAttributes<{}>) => {
    return (
        <div className={"flex flex-col items-center gap-y-4 mx-8 " + props.className} >
            <img src={ispor_logo} alt="" className="mt-8 w-28 object-scale-down" />
            <p className="text-xs text-center text-secondary-color">The Professional Society For Health Economics And Outcomes Research, University Of Nigeria</p>
            <p className="text-sm font-semibold text-center text-secondary-color">The Editorial Team, UNN </p>
            <div className="flex gap-x-2">
                {
                    allBookSections.map(section => (
                        <a key={section.id} href={SITE_PROTOCOL + window.location.host + "/#" + section.id} className="underlin text-xs font-semibold text-center bg-white/10 hover:bg-white/50 text-secondary-color border border-secondary-color/20 p-2 rounded">{section.title}</a>
                    ))
                }
            </div>
            <img src={unn_logo} alt="" className="w-12 object-scale-down" />
        </div>
    )
}