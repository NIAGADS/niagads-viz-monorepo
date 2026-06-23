import { useEffect, useState, useRef } from "react";
import styles from "./back-to-top.module.css";

export function BackToTop() {
    const [visible, setVisible] = useState(false);
    const lastY = useRef(0);

    useEffect(() => {
        const threshold = window.innerHeight;
        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const y = window.scrollY;
                    setVisible(y < lastY.current && y > threshold);
                    lastY.current = y;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <button
            className={`${styles["back-to-top"]} ${visible ? styles.visible : ""}`}
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
        </button>
    );
}
