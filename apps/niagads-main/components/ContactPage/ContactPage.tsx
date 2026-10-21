import { ArrowUpRight, CalendarDays, Mail } from "lucide-react";
import styles from "./contact-page.module.css";

interface ContactPageProps {
    helpHoursUrl: string;
}

export const ContactPage = ({ helpHoursUrl }: ContactPageProps) => {
    return (
        <div className={styles["contact-page"]}>
            <header className={styles["contact-page-header"]}>
                <h1>Contact Us</h1>
                <p>
                    Have questions about NIAGADS? Our team can help with general
                    inquiries, technical support, and data access questions.
                </p>
            </header>

            <div className={styles["contact-options"]}>
                <section className={styles["contact-card"]} aria-labelledby="email-support-heading">
                    <div className={styles["contact-card-header"]}>
                        <Mail size={24} aria-hidden="true" />
                        <h2 id="email-support-heading">Email Our Support Team</h2>
                    </div>
                    <p>
                        For questions about NIAGADS resources, tools, or data
                        access requests, email our team. A staff member will
                        follow up with you.
                    </p>
                    <a className={styles["contact-link"]} href="mailto:help@niagads.org">
                        help@niagads.org
                        <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                </section>

                <section className={styles["contact-card"]} aria-labelledby="help-hours-heading">
                    <div className={styles["contact-card-header"]}>
                        <CalendarDays size={24} aria-hidden="true" />
                        <h2 id="help-hours-heading">NIAGADS Help Hours</h2>
                    </div>
                    <p>
                        Prefer to speak with our team? Book a help session for
                        assistance navigating NIAGADS resources, data, and tools.
                    </p>
                    <a
                        className={styles["booking-link"]}
                        href={helpHoursUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Schedule a Help Session
                        <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                </section>
            </div>
        </div>
    );
};
