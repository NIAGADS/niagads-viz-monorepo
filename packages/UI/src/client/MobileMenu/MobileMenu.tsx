import type { HeaderProps, NavigationMenuLink } from "../Header";
import React, { ReactNode, useEffect, useRef } from "react";

import { X } from "lucide-react";
import styles from "./mobile-menu.module.css";

export interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    links: NavigationMenuLink[];
    title?: string;
    search?: ReactNode;
    footer?: ReactNode;
    linkComponent?: HeaderProps["linkComponent"];
}

export const MobileMenu = ({
    isOpen,
    onClose,
    links,
    title = "Navigation",
    search,
    footer,
    linkComponent: Link = "a",
}: MobileMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus();
        };
    }, [isOpen]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onClose();
        }
        if (event.key !== "Tab") return;

        const focusable = Array.from(
            menuRef.current?.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            ) ?? []
        ).filter((element) => element.getClientRects().length > 0 && element.tabIndex >= 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles["mobile-menu-overlay"]} onClick={onClose} aria-hidden="true" />
            <div
                className={styles["mobile-menu"]}
                ref={menuRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onKeyDown={handleKeyDown}
            >
                <div className={styles["mobile-menu-header"]}>
                    <div className={styles["mobile-menu-title"]}>{title}</div>
                    <button
                        type="button"
                        className={styles["mobile-menu-close"]}
                        ref={closeRef}
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <X size={24} aria-hidden="true" />
                    </button>
                </div>
                {search && <div className={styles["mobile-menu-search"]}>{search}</div>}
                <nav className={styles["mobile-menu-nav"]} aria-label="Mobile navigation">
                    {links.map((link) => (
                        <Link
                            key={`${link.text}-${link.url}`}
                            href={link.url}
                            className={`${styles["mobile-menu-link"]} ${link.active ? styles.active : ""}`}
                            onClick={onClose}
                            aria-current={link.active ? "page" : undefined}
                        >
                            {link.text}
                        </Link>
                    ))}
                </nav>
                {footer && <div className={styles["mobile-menu-footer"]}>{footer}</div>}
            </div>
        </>
    );
};
