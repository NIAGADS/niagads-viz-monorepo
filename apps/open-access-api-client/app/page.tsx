"use client";

import { getCurrentVersion } from "@/utils/versioning";
import { Alert, Button } from "@niagads/ui";

import { useRouter } from "next/navigation";

export default function Home() {
    const currentVersion = getCurrentVersion();
    const router = useRouter();
    const handleReadTheDocsClick = (e: any) => {
        e.preventDefault();
        router.push("/docs");
    };
    return (
        <main>
            <div className="w-full">
                <div className="mt-2 flex flex-col justify-center items-center">
                    <div className="text-6xl">NIAGADS Open Access API</div>
                    <div className="text-lg mt-8">version {currentVersion}</div>
                    <div className="mt-8">
                        <Button size="lg" variant="default" onClick={handleReadTheDocsClick}>
                            Read the Docs
                        </Button>
                    </div>
                </div>
                <div className="pt-8 pb-8 flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-normal">About NIAGADS Open Access</h1>
                    <div className="-p-3 max-w-[750px]">
                        The National Institute on Aging Genetics of Alzheimer&apos;s Disease Data Storage Site (
                        <a href="https://www.niagads.org/" target="_blank">
                            NIAGADS
                        </a>
                        ) stores and distributes genetics and genomics data from studies on Alzheimer&apos;s disease,
                        related dementias, and aging to qualified researchers globally.
                    </div>
                    <div className="p-3 max-w-[750px]">
                        <a href="https://www.niagads.org/open-access/" target="_blank">
                            NIAGADS Open Access
                        </a>{" "}
                        is a collection of files and web-based knowledgebases made available to the public with no data
                        access restrictions. Our application programming interface (API) provides programmatic accesses
                        to these resources, allowing users to integrate our data and annotations into their own analysis
                        pipelines, facilitating investigations at chromosome- and genome-wide scales.{" "}
                    </div>
                    <div className="max-w-[750px]">
                        The NIAGADS API uses HTTP requests to access and disseminate data from unrestricted, public
                        NIAGADS knowledgebases. It has predictable resource- and genomic-feature oriented URLs and
                        returns JSON-encoded responses, associated with standard HTTP response codes.
                    </div>
                    <div className="mt-8">
                        <Alert variant="warning" message="Resource in Alpha">
                            More information and expanded functionality coming soon.
                        </Alert>
                    </div>
                </div>
            </div>
        </main>
    );
}
