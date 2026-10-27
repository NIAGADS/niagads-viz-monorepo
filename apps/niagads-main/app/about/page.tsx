"use client";

import AboutContent from "@/data/about.mdx";
import { Alert } from "@niagads/ui";

export default function AboutPage() {
    return (
        <main>
            <div className="content-section content-section-centered">
                <div className="mdx-content">
                    <AboutContent components={{ Alert }} />
                </div>
            </div>
        </main>
    );
}
