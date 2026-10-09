import Image from "next/image";

import { SubscribeCard } from "./SubscribeCard";
import styles from "./home-page-mission.module.css";

const partners = [
    {
        name: "National Institute on Aging",
        logo: "/partners/nia.svg",
    },
    {
        name: "University of Pennsylvania",
        logo: "/partners/penn.svg",
    },
    {
        name: "Alzheimer's Disease Sequencing Project",
        logo: "/partners/adsp.svg",
    },
    {
        name: "Alzheimer's Disease Genetics Consortium",
        logo: "/partners/adgc.svg",
    },
    {
        name: "AD Knowledge Portal",
        logo: "/partners/ad-knowledge-portal.svg",
    },
    {
        name: "National Alzheimer's Coordinating Center",
        logo: "/partners/nacc.svg",
    },
    {
        name: "National Centralized Repository for Alzheimer's Disease",
        logo: "/partners/ncrad.svg",
    },
    {
        name: "NIA-AD Family Based Study",
        logo: "/partners/nia-ad-fbs.svg",
    },
];

export const HomePageMission = () => {
    return (
        <div className={styles["home-page-mission"]}>
            <section
                className={styles["about-section"]}
                aria-labelledby="niagads-about-heading"
            >
                <div className="content-section-centered">
                    <div className={styles["about-content"]}>
                        <div
                            className={`${styles.eyebrow} text-sm font-bold`}
                        >
                            <span>About NIAGADS</span>
                        </div>

                        <h2
                            id="niagads-about-heading"
                            className={styles["about-heading"]}
                        >
                            Supporting Alzheimer&apos;s genetics and genomics
                            research
                        </h2>

                        <p className="text-lg">
                            NIAGADS advances Alzheimer&apos;s disease and related
                            dementias research by preserving and sharing genomic
                            and associated data. We connect researchers with
                            data, resources, and tools to support discovery.
                        </p>

                        <div className={styles["subscribe-card"]}>
                            <SubscribeCard />
                        </div>
                    </div>
                </div>
            </section>

            <section
                className={styles["partners-section"]}
                aria-labelledby="niagads-partners-heading"
            >
                <div className={`${styles["partners-content"]} content-section-centered`}>
                     <div className={styles["about-content"]}>
                    <h2
                        id="niagads-partners-heading"
                        className={`${styles.eyebrow} text-sm font-bold`}
                    >
                        <span>
                            Research Partners &amp; Community Resources
                        </span>

                
                    </h2>
                    <p className={`${styles["partner-description"]} text-lg`}>
                           NIAGADS is a collaboration among the following organizations, which may also provide funding and/or governance:
                    </p>
                </div>    

                    <div className={styles["partner-scroll"]}>
                        <div
                            className={styles["partner-row"]}
                            role="list"
                            aria-label="NIAGADS research partners and community resources"
                        >
                            {partners.map((partner) => (
                                <div
                                    key={partner.name}
                                    className={styles["partner-logo"]}
                                    role="listitem"
                                >
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        width={180}
                                        height={70}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};