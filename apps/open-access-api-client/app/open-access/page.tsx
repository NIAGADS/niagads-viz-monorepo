import { NIAGADSFilerLogo, NIAGADSGenomicsDBLogo, NIAGADSXQTLLogo } from "@niagads/ui";
import type { Metadata } from "next";
import Link from "next/link";

import { OPEN_ACCESS_RESOURCES, ROLLOUT_ITEMS, ROLLOUT_STATUSES } from "@/data/open-access";

import styles from "./open-access.module.css";

export const metadata: Metadata = {
    title: "Open Access",
    description:
        "Discover NIAGADS open access genetics and genomics resources, current API availability, and upcoming additions.",
};

const resourceLogos = {
    genomicsdb: NIAGADSGenomicsDBLogo,
    topgenes: null,
    advp: null,
    filer: NIAGADSFilerLogo,
    xqtl: NIAGADSXQTLLogo,
};

export default function OpenAccessPage() {
    return (
        <div className={styles.page}>
            <header className={styles.intro}>
                <h1>NIAGADS Open Access</h1>
                <p className={styles.lead}>Genetics and genomics resources for Alzheimer’s disease research.</p>
                <p>
                    NIAGADS open access resources bring together genetic associations, variant annotations, and
                    functional genomics evidence for Alzheimer’s disease and related dementias (AD/ADRD). Explore the
                    resource websites or use the Open Access API to bring these data into your research workflows.
                </p>
                <p>
                    The API provides programmatic access to search and retrieve data, annotations, and metadata. ASK
                    NIAGADS also lets you explore available data using natural-language questions.
                </p>
                <div className={styles.actions}>
                    <Link className={styles.primaryLink} href="/ask">
                        Explore with ASK NIAGADS
                    </Link>
                    <Link className={styles.textLink} href="/docs">
                        Read the API documentation <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </header>

            <section className={styles.section} aria-labelledby="rollout-heading">
                <div className={styles.sectionHeading}>
                    <h2 id="rollout-heading">Expanding API access</h2>
                    <p>
                        Access is rolling out in stages. Each item shows its own API availability; planned additions are
                        shown in rollout order.
                    </p>
                </div>
                <ol className={styles.rollout} aria-label="API rollout order">
                    {ROLLOUT_ITEMS.map((item) => (
                        <li key={item.id} className={styles.rolloutItem} data-status={item.status}>
                            <span className={styles.status}>{ROLLOUT_STATUSES[item.status]}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <a className={styles.itemLink} href={`#resource-${item.resourceId}`}>
                                About the resource <span aria-hidden="true">&darr;</span>
                            </a>
                        </li>
                    ))}
                </ol>
            </section>

            <section className={styles.section} aria-labelledby="resources-heading">
                <div className={styles.sectionHeading}>
                    <h2 id="resources-heading">Explore the open access resources</h2>
                    <p>
                        Visit each resource for its data and tools. Website access is available independently of the API
                        rollout above.
                    </p>
                </div>
                <ul className={styles.resources}>
                    {OPEN_ACCESS_RESOURCES.map((resource) => {
                        const Logo = resourceLogos[resource.id];

                        return (
                            <li key={resource.id} id={`resource-${resource.id}`} className={styles.resource}>
                                <div className={styles.resourceIdentity}>
                                    {Logo ? (
                                        <Logo
                                            className={styles.logo}
                                            width={210}
                                            height={50.673}
                                            role="img"
                                            aria-label={resource.name}
                                        />
                                    ) : (
                                        <span className={styles.partnerName}>
                                            {resource.id === "advp" ? "ADVP" : "TopGenes"}
                                        </span>
                                    )}
                                    {resource.partner && <span className={styles.partnerLabel}>Partner resource</span>}
                                </div>
                                <div className={styles.resourceDescription}>
                                    <h3>{resource.name}</h3>
                                    <p>{resource.description}</p>
                                    <a className={styles.textLink} href={resource.url}>
                                        Visit {resource.id === "advp" ? "ADVP" : resource.name}
                                        <span aria-hidden="true"> &rarr;</span>
                                    </a>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}
