import { createContext, useContext, useState } from "react";
import { jprint } from "../../core/utils";

type Config = { "closeOnExternalTap": boolean };
type FunctionORVoid<T extends Config> = T["closeOnExternalTap"] extends true ? void : T["closeOnExternalTap"] extends false ? () => void : undefined;
type ShowBottomSheetFunctionType = <S extends Config>(child: JSX.Element, config: S) => FunctionORVoid<S>

const showBottomSheetDefault: ShowBottomSheetFunctionType = <S extends Config>() => {
    return ((() => { }) as FunctionORVoid<S>);
}
type ContextType = { showBottomSheet: ShowBottomSheetFunctionType; isOpen: boolean; closeBottomSheet: () => void; };
const BottomSheetContext = createContext<ContextType>({ showBottomSheet: showBottomSheetDefault, isOpen: false, closeBottomSheet: () => { } });

export const BottomSheetProvider = (props: React.BaseHTMLAttributes<{}>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [child, setChild] = useState<JSX.Element | undefined>(undefined);
    const [closeOnExternalTap, setCloseOnExternalTap] = useState(false);

    function closeBottomSheet() {
        if (isOpen) {
            setIsOpen(false);
        }
    }

    function onExternalClick() {
        if (closeOnExternalTap) {
            closeBottomSheet();
        }
    }


    const showBottomSheet: ShowBottomSheetFunctionType = <C extends Config>(child: JSX.Element, config: C): FunctionORVoid<C> => {
        setCloseOnExternalTap(config.closeOnExternalTap)

        if (!isOpen) {
            setIsOpen(true)
        }
        setChild(child);
        return closeBottomSheet as FunctionORVoid<C>;
    }

    return (
        <BottomSheetContext.Provider value={{ showBottomSheet, isOpen, closeBottomSheet }}>
            <div className="relative">
                {/* Sheet */}
                <div className={"overflow-scroll scrollbar-hide fixed z-[500] bottom-0 bg-gray-800 h-[85%] w-full rounded-ss-2xl rounded-se-2xl transition-transform duration-700 " + (isOpen ? "translate-y-0" : "translate-y-full")}>
                    {child}
                </div>
                {/* Overlay */}
                <div onClick={onExternalClick} className={"absolute h-full w-screen bg-black/40 " + (isOpen ? "z-50" : "-z-50")} />
                {/* Children */}
                <div className={"z-0 " + (isOpen ? " h-full overflow-hidden" : "")}>
                    {props.children}
                </div>
            </div>
        </BottomSheetContext.Provider>
    )

}

export const useShowBottomSheet = () => {
    const bottomSheetCtx = useContext(BottomSheetContext);
    return bottomSheetCtx;
}


