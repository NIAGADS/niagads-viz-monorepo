import React, { ReactNode } from "react";
import { Menu } from "lucide-react";

import styles from "./header.module.css";

interface HeaderProps {
    logo: string;
    links: HeaderLink[];
    children?: ReactNode;
};

interface HeaderLink {
    text: string;
    url: string;
}

export const Header = ({
    logo,
    links,
    children,
}: HeaderProps) => {
    return (
        <header className={styles["header"]}>
            <div className={styles["logo-container"]}>
                <div className={styles["logo"]}>
                    <a className={styles["active-menu-item"]} href="/">
                        <figure>
                            {logo}
                        </figure>
                    </a>
                </div>
            </div>
            <button
                className={styles["mobile-menu-button"]}
                aria-label="Toggle menu"
                aria-expanded="false"
            >
                <Menu size={24} />
            </button>
            <nav className={styles["main-nav"]} role="navigation" aria-label="Main navigation">
                {links.map(link => (
                    <a
                        key={link.text}
                        href={link.url}
                        className={styles["nav-link"]}
                    >
                        {link.text}
                    </a>
                ))}
                {children}
            </nav>
        </header>
    )
};
