import { createContext, useState, useContext, useRef, useEffect } from "react";
import { BookInfo } from "../../domain/models/book_info";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import ContentCopy from "@mui/icons-material/ContentCopy";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { BookSection, allBookSections } from "../../domain/models/book_sections";

export const Publications = (props: React.BaseHTMLAttributes<{}>) => {

    return (
        <div {...props} className={props.className + " "}>
            <p className="text-2xl text-white font-semibold mb-4">Editorial Corner</p>
            {
                allBookSections.map(section => <BooksSection key={section.id} section={section} />)
            }
        </div>
    )
}

const Scroll = (props: { children: React.ReactNode, padding: number }) => {
    type OverflowState = 'start' | 'end' | 'both' | 'none';

    const scrollElement = useRef<HTMLDivElement | null>(null);
    const scrollFirstElement = useRef<HTMLDivElement | null>(null);
    const scrollLastElement = useRef<HTMLDivElement | null>(null);
    const [overflowState, setOverflowState] = useState<OverflowState>("none")

    function getOverflowStatus(firstElement: HTMLDivElement | null, secondElement: HTMLDivElement | null, scrollElement: HTMLDivElement | null): OverflowState {
        if (firstElement !== null && secondElement !== null && scrollElement != null) {
            const rectFirst = firstElement.getBoundingClientRect();
            const rectSecond = secondElement.getBoundingClientRect();
            const rectScrollElement = scrollElement.getBoundingClientRect();

            const startIsOverflowed = rectFirst.left < rectScrollElement.left;
            const endIsOverflowed = rectSecond.right > rectScrollElement.right;

            if (startIsOverflowed && endIsOverflowed) {
                return 'both';
            } else if (startIsOverflowed) {
                return 'start'
            } else if (endIsOverflowed) {
                return 'end';
            }
        }
        return 'none';
    }

    function getAndSetState() {
        const state = getOverflowStatus(scrollFirstElement.current, scrollLastElement.current, scrollElement.current);

        if (overflowState !== state) {
            setOverflowState(state);
        }
    }

    useEffect(() => {
        getAndSetState();
        function listener(_ev: UIEvent) {
            getAndSetState();
        }
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, []);

    const dragHandler: React.UIEventHandler<HTMLDivElement> | undefined = (ev) => {
        ev.preventDefault();
        getAndSetState();
    }

    //TODO: Implement Padding
    return (
        <div className="relative">
            <div onScroll={dragHandler} onResizeCapture={dragHandler} ref={scrollElement} className="overflow-x-scroll scrollbar-hide flex flex-nowrap gap-x-6">
                <div ref={scrollFirstElement} key={"first"} />
                {props.children}
                <div ref={scrollLastElement} key={"last"} />
            </div>

            {
                overflowState !== "none" && (overflowState === "start" || overflowState === "both") ?
                    (
                        <div className="flex flex-col justify-center items-center absolute inset-0 w-12 h-full bg-gradient-to-r from-card-dark to-transparent text-white" >
                            <KeyboardArrowLeft />
                        </div>
                    )
                    : null
            }
            {
                overflowState !== "none" && (overflowState === "end" || overflowState === "both") ?
                    (
                        <div className="flex flex-col justify-center items-center absolute top-0 end-0 w-12 h-full bg-gradient-to-l from-card-dark to-transparent text-white">
                            <KeyboardArrowRight />
                        </div>
                    )
                    : null
            }
        </div>
    )
}

const BooksSectionContext = createContext((_info: BookInfo | undefined) => { });

const BooksSection = (props: {
    section: BookSection
}) => {
    const [orderInfo, setOrderInfo] = useState<BookInfo | undefined>(undefined);
    const [copyText, setCopyText] = useState("Copy");

    function onPreOrderClicked(info: BookInfo | undefined) {
        setOrderInfo(info);
    }

    function copyAccountNumber(acct: string) {
        navigator.clipboard.writeText(acct).then(
            () => setCopyText("Copied")
        );
    }

    const purchaseInfo = orderInfo?.details?.purchaseInfo;

    return (
        <BooksSectionContext.Provider value={onPreOrderClicked}>
            <section id={props.section.id} className="mt-6 bg-card-dark rounded-lg pb-12">
                <div className="p-6 mb-4">
                    <p className="text-white/80 font-semibold">{props.section.title}</p>
                    <hr className="my-4 border-neutral-500" />
                    <p className="text-sm text-white/60 font-light">{props.section.desc}</p>
                </div>

                <Scroll padding={26}>
                    {
                        props.section.books.map(book => <BookCard key={book.id} book={book} />)
                    }
                </Scroll>

                {/* Account Details */}

                <div className={"flex justify-center flex-wrap gap-x-6 rounded-lg bg-white/10 transition-all duration-1000 delay-100 " + (orderInfo ? "m-6 p-4 opacity-100" : "h-0 opacity-0")}>
                    {
                        orderInfo?.details && purchaseInfo ?
                            <>
                                <div className="min-w-[128px] overflow-clip shadow-md shadow-gray-700 mb-4 flex flex-col items-center justify-center h-[180px] bg-gray-800/75 rounded-lg">
                                    <img className=" object-cover" src={'.' + orderInfo.details.cover} alt={orderInfo.details.title} />
                                </div>

                                <div className="flex grow flex-col gap-y-2 text-primary-color">
                                    <p className="font-semibold">{orderInfo.details.title}</p>
                                    <p className="text-xs">Send {purchaseInfo.price} To</p>
                                    <hr className="my-2" />
                                    <p className="text-sm font-semibold">{purchaseInfo.bank}</p>
                                    <p className="text-sm">
                                        <span>Account : </span>
                                        <span className="font-semibold mr-2">{purchaseInfo.account}</span>
                                        <span onClick={() => copyAccountNumber(purchaseInfo.account)} className="select-none text-xs hover:active:underline whitespace-nowrap">
                                            <ContentCopy className="" fontSize="small" /> {copyText}
                                        </span>
                                    </p>
                                    <p className="text-sm">
                                        <span>Name : </span>
                                        <span className="font-semibold">{purchaseInfo.name}</span>
                                    </p>
                                    <a href={"tel://" + purchaseInfo.phone} className="select-none hover:active:bg-emerald-500 p-2 bg-emerald-600 rounded-lg my-4">
                                        <p className=" text-white text-center text-xs font-semibold">Reach Us For Confirmation</p>
                                    </a>
                                </div>
                            </> : null
                    }

                </div>

            </section>
        </BooksSectionContext.Provider>


    )
}

const BookCard = (props: { book: BookInfo }) => {
    const onPreOrderClicked = useContext(BooksSectionContext);
    const details = props.book.details;
    return (
        <div>
            {
                details === undefined ? (
                    <div className="w-32">
                        <div className="border-2 border-white/30 shadow-md shadow-gray-00 mb-4 flex flex-col items-center justify-center h-[180px] bg-gray-900/75 rounded-lg">
                            <p className="text-7xl text-white/50 contet-center">?</p>
                            <p className="text-sm text-white/50 contet-center mt-4">{props.book.edition} Edition</p>
                        </div>
                        <p className="text-sm text-white/70 font-light text-center">Coming Soon</p>
                    </div>
                ) : (
                    <div className="w-32">
                        <div className="overflow-clip shadow-md shadow-gray-700 mb-4 flex flex-col items-center justify-center h-[180px] bg-gray-800/75 rounded-lg">
                            <img className="object-cover" src={"." + details.cover} alt={details.title} />
                        </div>
                        <p className="text-xs text-white/70 font-light text-center mb-2">{props.book.edition} Edition</p>
                        <a download={true} href={details.purchaseInfo ? undefined : '.' + details.link} onClick={details.purchaseInfo ? () => onPreOrderClicked(props.book) : undefined} className="mx-auto block text-sm text-white font-normal text-center hover:active:underline select-none">{details.purchaseInfo ? 'Pre Order' : 'Download'}</a>
                    </div>)
            }

        </div>

    )
}