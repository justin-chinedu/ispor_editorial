import { useState } from "react";
import { FilterSection } from "./filters";
import { jprint } from "../../core/utils";

export const FilterFrame = (props: { sections: FilterSection<any>[], onFilter: (sections: FilterSection<any>[]) => void }) => {
    const [filterSections, setFilterSections] = useState(props.sections);
    const [selectedMessage, setSelectedMessage] = useState<{ section: number, message: string | undefined }>();

    function onOptionSelected(sectionIndex: number, optionIndex: number) {
        const selectedSection = { ...filterSections[sectionIndex], selectedOption: optionIndex };
        const newSections = filterSections.map((s, i) => i === sectionIndex ? selectedSection : s);
        const message = selectedSection.options[optionIndex].messageOnSelected;
        if (message || selectedMessage?.section == sectionIndex) {
            setSelectedMessage({ section: sectionIndex, message: message })
        }
        setFilterSections(newSections);
    }

    return (
        <div className="flex flex-col gap-y-4 border border-gray-400 w-full rounded-lg p-4">
            {
                filterSections.map((section, sectionIndex) => (
                    <section key={section.title}>
                        <div className="flex text-sm text-white/60 gap-x-2  items-center mb-3">
                            {section.title}
                            {section.icon}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {
                                section.options.map((option, optionIndex) => {
                                    const isSelected = section.selectedOption == optionIndex;

                                    return <button key={option.title} onClick={() => onOptionSelected(sectionIndex, optionIndex)} className={"text-white text-xs p-2 rounded-lg " + (isSelected ? "bg-emerald-600" : "bg-slate-600 opacity-60")} type="button">{option.title}</button>
                                })
                            }
                        </div>
                        {selectedMessage && selectedMessage.section == sectionIndex ? <p className=" mt-2 text-xs font-light text-white/90">{selectedMessage.message}</p> : null}
                    </section>
                ))
            }

            <button onClick={() => props.onFilter(filterSections)} className="p-2 rounded-lg bg-emerald-600 text-white text-sm" type="button">Filter</button>

        </div>
    )
}
