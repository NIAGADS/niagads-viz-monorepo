import Link from "next/link";
import React from "react";
import styles from "../styles/footer.module.css";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles["ui-footer"]}>
            <div className={styles["ui-footer-container"]}>
                <div className={styles["ui-footer-left"]}>
                    <div className={styles["ui-footer-logo"]}>
                        <span className={styles["ui-footer-logo-text"]}>NIAGADS GenomicsDB</span>
                    </div>
                    <p className={styles["ui-footer-copyright"]}>© {currentYear} NIAGADS. All rights reserved.</p>
                </div>

                <div className={styles["ui-footer-right"]}>
                    <nav className={styles["ui-footer-nav"]}>
                        <Link href="/about" className={styles["ui-footer-link"]}>
                            About
                        </Link>
                        <a href="#" className={styles["ui-footer-link"]}>
                            Contact
                        </a>
                        <a href="#" className={styles["ui-footer-link"]}>
                            Privacy
                        </a>
                        <a href="#" className={styles["ui-footer-link"]}>
                            Terms
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
};
