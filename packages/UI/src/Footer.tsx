import Link from "next/link";
import React from "react";
import styles from "./styles/footer.module.css";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles["footer"]}>
            <div className={styles["footer-container"]}>
                <div className={styles["footer-left"]}>
                    <div className={styles["footer-logo"]}>
                        <span className={styles["footer-logo-text"]}>NIAGADS GenomicsDB</span>
                    </div>
                    <p className={styles["footer-copyright"]}>© {currentYear} NIAGADS. All rights reserved.</p>
                </div>

                <div className={styles["footer-right"]}>
                    <nav className={styles["footer-nav"]}>
                        <Link href="/about" className={styles["footer-link"]}>
                            About
                        </Link>
                        <a href="#" className={styles["footer-link"]}>
                            Contact
                        </a>
                        <a href="#" className={styles["footer-link"]}>
                            Privacy
                        </a>
                        <a href="#" className={styles["footer-link"]}>
                            Terms
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
};
