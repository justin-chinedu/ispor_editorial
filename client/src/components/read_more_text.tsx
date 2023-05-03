import { useRef, useState, useEffect } from "react";

export const ReadMoreText = (props: { maxLines: number } & React.BaseHTMLAttributes<{}>) => {
    const messageRef = useRef<HTMLParagraphElement | null>(null);
    const [clampText, setClampText] = useState(false);
    const [showMoreButton, setShowMoreButton] = useState(false);


    useEffect(() => {
        const p = messageRef.current;
        if (p) {
            const lines = p.getBoundingClientRect().height / 20;
            if (lines > props.maxLines) {
                setClampText(true);
                setShowMoreButton(true);
                p.style.webkitLineClamp = props.maxLines.toString()
            }
        }
    }, [messageRef])

    return (
        <div className={props.className}>
            <p ref={messageRef} className={"w-full whitespace-break-spaces text-sm text-ellipsis overflow-hidden " + (clampText ? "line-clamp-1" : "")}>{props.children}</p>
            {
                showMoreButton ?
                    <button onClick={() => setClampText(v => !v)} type="button" className={"inline text-sm font-bold mt-2"}>{clampText ? "Show more" : "Show less"}</button>
                    : null
            }
        </div>

    )
}
