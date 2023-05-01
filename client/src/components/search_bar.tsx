import { useEffect, useState } from "react";

export const SearchBar = (props: { searchText?: string, onSearchSubmit?: (text: string) => void }) => {
    const [searchText, setSearchText] = useState(props.searchText ?? "");

    useEffect(() => {
        setSearchText(props.searchText ?? "")
    }, [props.searchText])


    const handleSearchInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        const text = e.target?.value ?? "";
        setSearchText(text);
    }

    const disabled = searchText.length == 0;

    return (
        < div className="flex gap-x-2 items-center" >
            <input onChange={handleSearchInput} value={searchText} className="min-w-[24px] bg-gray-700/20 appearance-none border border-transparent focus:border-primary-color/50 rounded-lg w-full py-3 px-2 text-neutral-600 placeholder:text-neutral-600 leading-tight focus:outline-none focus:shadow-outline text-xs" placeholder="Search for keyword or name" type="text" name="Search" id="search" title="Search" />
            <button disabled={disabled} onClick={() => props.onSearchSubmit?.(searchText)} type="button" className={"bg-emerald-600 hover:active:bg-emerald-700 text-white rounded-lg py-2 px-4 " + (disabled ? "opacity-40" : "")}>
                <p className="text-xs">Search</p>
            </button>
        </div>
    )
}