import Link from "next/link";
import React from "react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="ui-footer">
            <div className="ui-footer-container">
                <div className="ui-footer-left">
                    <div className="ui-footer-logo">
                        <span className="ui-footer-logo-text">NIAGADS GenomicsDB</span>
                    </div>
                    <p className="ui-footer-copyright">© {currentYear} NIAGADS. All rights reserved.</p>
                </div>

                <div className="ui-footer-right">
                    <nav className="ui-footer-nav">
                        <Link href="/about" className="ui-footer-link">
                            About
                        </Link>
                        <a href="#" className="ui-footer-link">
                            Contact
                        </a>
                        <a href="#" className="ui-footer-link">
                            Privacy
                        </a>
                        <a href="#" className="ui-footer-link">
                            Terms
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
};
