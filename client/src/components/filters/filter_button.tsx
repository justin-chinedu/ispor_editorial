import Sort from "@mui/icons-material/Sort";

export const FilterButton = (props: { active: boolean, onClick: () => void }) => {
    return (
        <button type="button" onClick={props.onClick} className={"text-lg text-white flex justify-end items-center gap-x-2 rounded-lg w-fit py-1 px-2 " + (props.active ? "bg-slate-700" : "")}>
            <Sort fontSize="inherit" />
            <p className="text-[12px]">{"Filter by"}</p>
        </button>
    );
}

