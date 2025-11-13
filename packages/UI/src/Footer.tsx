import Link from "next/link";
import React from "react";
import styles from "./styles/footer.module.css";

interface FooterLink {
    display: string;
    url: string;
}

interface FooterProps {
    siteName: string;
    links: FooterLink[];
}

export const Footer = ({ siteName, links }: FooterProps) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles["footer"]}>
            <div className={styles["footer-container"]}>
                <div className={styles["footer-left"]}>
                    <div className={styles["footer-logo"]}>
                        <span className={styles["footer-logo-text"]}>{siteName}</span>
                    </div>
                    <p className={styles["footer-copyright"]}>© {currentYear} NIAGADS. All rights reserved.</p>
                </div>
                <div className={styles["footer-right"]}>
                    <nav className={styles["footer-nav"]}>
                        {links.map((link, i) => (
                            <Link key={i} href={link.url} className={styles["footer-link"]}>
                                {link.display}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
};
