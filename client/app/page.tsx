"use client";
import { Alert } from "@/components/UI/Alert";
import { Button } from "@/components/UI/Button";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const handleReadTheDocsClick = (e: any) => {
        e.preventDefault();
        router.push("/docs");
    };
    return (
        <main className="p-0">
            <div className="w-full m-0 p-0">
                <div className="bg-slate-900 pt-52 pb-48 flex flex-col justify-center items-center">
                    <Alert variant="info" message="THE NIAGADS Open Access API is being updated!">
                        <div>
                            <p>
                                From 3/8/2025-4/1/2025 we will be rolling out an extended set of endpoints for the NIAGADS Open Access API.
                            </p>
                            <p>
                                During this time some endpoints may fail and <strong>VIEWS</strong> (e.g., tables, IGV browser) will be unavailable, and requests to generate views against the API will only return JSON responses.
                            </p>
                            <p>Our apologies for the inconvenience.</p>
                        </div>
                    </Alert>
                    <div className="text-secondary text-6xl">
                        NIAGADS Open Access API
                    </div>
                    <div className="text-white text-lg mt-8">
                        version 0.9.0a
                    </div>
                    <div className="mt-8">
                        <Button
                            size="lg"
                            variant="default"
                            onClick={handleReadTheDocsClick}>
                            Read the Docs
                        </Button>
                    </div>
                </div>
                <div className="pt-8 pb-8 flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-normal">
                        About NIAGADS Open Access
                    </h1>
                    <div className="-p-3 max-w-[750px]">
                        The National Institute on Aging Genetics of
                        Alzheimer&apos;s Disease Data Storage Site (
                        <a href="https://www.niagads.org/" target="_blank">
                            NIAGADS
                        </a>
                        ) stores and distributes genetics and genomics data from
                        studies on Alzheimer&apos;s disease, related dementias,
                        and aging to qualified researchers globally.
                    </div>
                    <div className="p-3 max-w-[750px]">
                        <a
                            href="https://www.niagads.org/open-access/"
                            target="_blank">
                            NIAGADS Open Access
                        </a>{" "}
                        is a collection of files and web-based knowledgebases
                        made available to the public with no data access
                        restrictions. Our application programming interface
                        (API) provides programmatic accesses to these resources,
                        allowing users to integrate our data and annotations
                        into their own analysis pipelines, facilitating
                        investigations at chromosome- and genome-wide scales.{" "}
                    </div>
                    <div className="max-w-[750px]">
                        The NIAGADS API uses HTTP requests to access and
                        disseminate data from unrestricted, public NIAGADS
                        knowledgebases. It has predictable resource- and
                        genomic-feature oriented URLs and returns JSON-encoded
                        responses, associated with standard HTTP response codes.
                    </div>
                    <div className="mt-8">
                        <Alert variant="warning" message="Resource in Alpha">
                            More information and expanded functionality coming
                            soon.
                        </Alert>
                    </div>
                </div>
            </div>
        </main>
    );
}

/*   <div className="pt-8 pb-8 flex flex-col justify-center items-center">
                <div>NIAGADS Resources with API Access</div>
                <div>
                    The NIAGADS Open Access API will ultimately provide access
                    to all public NIAGADS annotation resources. These incude the
                    following:{" "}
                </div>
                <div>
                    <div>genomicsDB</div>
                    <div>
                        <div>The NIAGADS Alzheimer's Genomics Database</div>
                        <div>
                            The NIAGADS Alzheimer's Genomics Database is
                            disease-centric, interactive knowledgebase for
                            Alzheimer's disease (AD) genetics. It provides a
                            platform for data sharing, discovery, and analysis
                            by making available AD-relevant GWAS summary
                            statistics datasets from the NIAGADS repository for
                            browsing and mining. Also available are detailed
                            reports that compile genetic evidence for AD-risk
                            with functional annotations in the context of gene
                            and variants.
                        </div>
                        <div>
                            <a href="https://www.niagads.org/genomics">
                                https://www.niagads.org/genomics
                            </a>
                        </div>
                        <div>
                            <ul>
                                <li>
                                    Find the top risk-associated variants in
                                    AD-relevant GWAS summary statistics
                                    datasets.
                                </li>
                                <li>
                                    Get AD-relevant genetic and functional
                                    annotations in the context of a gene or
                                    variant of interest.
                                </li>
                                <li>
                                    Get Alzheimer's Disease Sequencing Project (
                                    <a href="https://adsp.niagads.org">ADSP</a>)
                                    variant QC results and annotations.
                                </li>
                                <li>
                                    Fetch annotations for a single gene or
                                    variant or do efficient bulk lookups
                                    (feature lists or within a genomic region).
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            */
