import { useEffect, useState } from "react";
import { ForumSection, mockSections } from "../../domain/models/forum_section";
import { ReadMoreText } from "../read_more_text";
import { jprint } from "../../core/utils";
import { useAppDispatch } from "../../store";
import { setFilter } from "../questions/questions_slice";
import { selectForumState, setForumState } from "./section_slice";
import { useFetchAllSectionsQuery } from "./forum_section_api";
import { ProgressCircular } from "../progress/progress_circular";
import { useSelector } from "react-redux";

export const ForumSectionFrame = () => {
    const sections = useFetchAllSectionsQuery(null);
    const forumSections = sections.data ?? [];
    const primarySections = forumSections.filter(s => s.parent == undefined);
    const sectionsMap: Record<number, ForumSection[]> = {}
    const dispatch = useAppDispatch();
    for (const p of primarySections) {
        sectionsMap[p.id] = [];
        sectionsMap[p.id] = sectionsMap[p.id].concat(...forumSections.filter(s => s.parent === p.id));
    }

    const forumState = useSelector(selectForumState);
    const selectedPrimarySection = forumState.length > 0 ? primarySections.filter(p => p.id == forumState[0])[0] : primarySections[0];
    const [primarySection, setSelectedPrimarySection] = useState(selectedPrimarySection);
    const [subSection, setSelectedSubSection] = useState<ForumSection | null>(null);


    useEffect(() => {
        const res: number[] = [];
        if (primarySection) {
            res.push(primarySection.id);
        }
        if (subSection) {
            res.push(subSection.id);
        }
        dispatch(setForumState(res))
    }, [primarySection, subSection])

    if (!sections.data) {
        return (
            <div className="flex ml-1 gap-x-2">
                <ProgressCircular />
                <p className="text-white/60">Loading Sections</p>
            </div>
        );
    }

    const subSections = selectedPrimarySection ? sectionsMap[selectedPrimarySection.id] : [];
    const selectedSubSection = forumState.length > 1 ? subSections.filter(p => p.id == forumState[1])[0] : subSections[0];


    const handleSelect: React.ReactEventHandler<HTMLSelectElement> = (ev) => {
        const value = ev.currentTarget.value;
        const section = primarySections.filter(p => p.id.toString() === value)[0];
        if (section) {
            setSelectedPrimarySection(section);
        }
    }

    function onSubSelected(s: ForumSection) {
        setSelectedSubSection(s);
    }

    return (
        <>
            <label className="text-white/70 font-light text-sm " htmlFor="forum_sections">Anonymous Sections</label>
            <select value={selectedPrimarySection.id} onChange={handleSelect} className=" [&_option]:bg-card-dark [&_option]:text-xs outline-none p-0 bg-transparent focus:bg-transparent w-fit text-primary-color font-extrabold text-2xl" title="Forum Sections" name="Forum Sections" id="forum_sections">
                {
                    primarySections.map((s) =>
                        <option value={s.id}>{s.title}</option>
                    )
                }
            </select>
            <ReadMoreText maxLines={2} className="bg-card-dark p-4 rounded-lg text-primary-color/70 text-xs">{selectedPrimarySection.desc}</ReadMoreText>
            {subSections.length > 0 && <h4 className="text-white/70 text-sm ">Select Sub Section</h4>}
            <div className="flex flex-wrap gap-2">
                {
                    subSections.map(s => {
                        const isSelected = selectedSubSection ? selectedSubSection.id === s.id : false;
                        return <button key={s.title} onClick={() => onSubSelected(s)} className={"text-white text-xs p-2 rounded-lg " + (isSelected ? "bg-emerald-600" : "bg-slate-600 opacity-60")} type="button">{s.title}</button>;
                    }
                    )
                }
            </div>
            {subSections.length > 0 && <hr className="opacity-30" />}
        </>

        // <section className="p-4 h-48 w-full bg-card-dark rounded-lg">
        //     <h2 className="text-primary-color font-extrabold text-2xl">Sections</h2>
        //     <hr className="my-2 opacity-30"/>
        //     <ReadMoreText maxLines={4} className="text-white/70 text-xs">Aliquip ad tempor dolore qui est consequat non id non. Aliqua commodo velit reprehenderit dolor irure consectetur eu qui voluptate magna consectetur consectetur. Cupidatat ex aliquip officia culpa id dolore ex nisi est eiusmod aute eiusmod. Deserunt esse labore sit qui elit. Est non ut qui excepteur. Esse voluptate sit duis nulla dolor.</ReadMoreText>
        // </section>
    )
}
export const ForumSectionsForm = (props: { onChange: (section_ids: number[]) => void }) => {
    const sections = useFetchAllSectionsQuery(null);
    const forumSections = sections.data ?? [];
    const primarySections = forumSections.filter(s => s.parent == undefined);
    const sectionsMap: Record<number, ForumSection[]> = {}
    const dispatch = useAppDispatch();

    for (const p of primarySections) {
        sectionsMap[p.id] = [];
        sectionsMap[p.id] = sectionsMap[p.id].concat(...forumSections.filter(s => s.parent === p.id));
    }
    const [selectedPrimarySection, setSelectedPrimarySection] = useState(primarySections[0]);
    const [selectedSubSection, setSelectedSubSection] = useState<ForumSection | undefined>(undefined);

    useEffect(() => {
        const res: number[] = [];
        if (selectedPrimarySection) {
            res.push(selectedPrimarySection.id);
        }
        if (selectedSubSection) {
            res.push(selectedSubSection.id);
        }
        props.onChange(res)
    }, [selectedPrimarySection, selectedSubSection]);

    if (!sections.data) {
        return (
            <div className="flex ml-1 gap-x-2">
                <ProgressCircular />
                <p className="text-white/60">Loading Sections</p>
            </div>
        );
    }

    const subSections = selectedPrimarySection ? sectionsMap[selectedPrimarySection.id] : [];

    const handleSelect: React.ReactEventHandler<HTMLSelectElement> = (ev) => {
        const value = ev.currentTarget.value;
        const section = primarySections.filter(p => p.id.toString() === value)[0];
        if (section) {
            setSelectedPrimarySection(section);
        }
    }
    const handleSubSelect: React.ReactEventHandler<HTMLSelectElement> = (ev) => {
        const value = Number.parseInt(ev.currentTarget.value);
        const section = subSections[value];
        if (section) {
            setSelectedSubSection(section);
        }
    }
    return (
        <div className="flex gap-x-4">
            <form >
                <label className="mb-2 block text-white/70 font-light text-xs " htmlFor="forum_sections_input">Choose Section : </label>
                <select onChange={handleSelect} className=" [&_option]:bg-card-dark [&_option]:text-xs outline-none p-0 bg-transparent focus:bg-transparent w-fit text-primary-color font-light text-sm" title="Forum Sections Input" name="Forum Sections Input" id="forum_sections_input">
                    {
                        primarySections.map((s) =>
                            <option value={s.id}>{s.title}</option>
                        )
                    }
                </select>
            </form>
            {subSections.length > 0 &&
                <form >
                    <label className="mb-2 block text-white/70 font-light text-xs " htmlFor="forum_subsections_input">Sub Section</label>
                    <select disabled={subSections.length == 0} onChange={handleSubSelect} className=" [&_option]:bg-card-dark [&_option]:text-xs outline-none p-0 bg-transparent focus:bg-transparent w-fit text-primary-color font-light text-sm border-b border-primary-color appearance-none" title="Forum SubSections Input" name="Forum SubSections Input" id="forum_subsections_input">
                        <option value={-1}>{"none"}</option>
                        {
                            subSections.map((s) =>
                                <option value={s.id}>{s.title}</option>
                            )
                        }
                    </select>
                </form>
            }
        </div>

    )

}