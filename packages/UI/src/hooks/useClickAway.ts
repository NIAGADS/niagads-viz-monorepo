import { RefObject, useEffect } from "react";

export const useClickAway = (ref: RefObject<HTMLElement | null>, cb: () => void) => {
    useEffect(() => {
        const handleClickAway = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target! as Node)) {
                cb();
            }
        }

        document.addEventListener("mousedown", handleClickAway);

        return () => document.removeEventListener("mousedown", handleClickAway);
    }, [ref])
}
