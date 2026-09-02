"use client";

import Table from "@niagads/table";
import Image from "next/image";
import { TABLE } from "./tableData";

import timeline_figure from "@/public/adsp-release-timeline.svg";

const DataSummary = () => {
    async function getData() {
        let url =
            "https://sheets.googleapis.com/v4/spreadsheets/1s3A0oy5X05hQlJ28-waVlITXp5ZcBcmDdRSfD7jxttc/values/Sheet1?key=AIzaSyBAYMxl6ZLmxrH88itZ089bZFbqyJiD_MA";
        try {
            let res = await fetch(url);
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }

    async function renderData() {
        let data = await getData();
        const datav = data.values;
        const table = document.createElement("table");
        let tr = table.insertRow(-1);
        console.log(datav);

        for (let i = 0; i < datav[0].length; i++) {
            if (i === 1) {
                continue;
            }
            let th = document.createElement("th");
            th.textContent = datav[0][i];
            tr.appendChild(th);
        }

        for (let i = 1; i < datav.length; i++) {
            tr = table.insertRow(-1);

            for (let j = 0; j < datav[i].length; j++) {
                if (j === 1) {
                    continue;
                }
                let cell = tr.insertCell(-1);
                if (j === 0) {
                    cell.innerHTML = '<a href="' + datav[i][1] + '" target="_blank">' + datav[i][0] + "</a>";
                } else {
                    cell.textContent = datav[i][j];
                }
            }
        }
    }

    return (
        <article id="post-2194" className="post-2194 page type-page status-publish hentry">
            <header className="entry-header">
                <div className="container">
                    <h1 className="entry-title">Data Summary</h1>
                </div>
            </header>
            <div className="entry-content">
                <div className="container">
                    <div className="updated-date note">Last updated: March 13th, 2026</div>
                    <div className="wp-block-group max-width-700">
                        <div className="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow">
                            <div style={{ height: "30px" }} aria-hidden="true" className="wp-block-spacer"></div>
                            <p className="has-text-align-center wp-block-paragraph">
                                <strong>Current timelines for ADSP data production and release</strong>
                            </p>

                            <figure className="wp-block-image size-large">
                                <Image width={700} height={400} src={timeline_figure} alt="adsp production and release timeline" />
                            </figure>

                            <div style={{ height: "30px" }} aria-hidden="true" className="wp-block-spacer"></div>
                        </div>
                    </div>

                    <div className="wp-block-group group-grid-1-1">
                        <div className="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow">
                            <div className="wp-block-group group-text-block">
                                <div className="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow">
                                    <h3 className="wp-block-heading">
                                        Release 2 WES: <br />
                                        20,503 whole exomes from 28 cohorts.
                                    </h3>
                                    <ul className="wp-block-list more-space-list">
                                        <li>
                                            Population breakdown: 4,349 African Ancestry, 13,904 Non-Hispanic White
                                            (NHW), 2,235 Hispanic, 15 Unknown/Other
                                        </li>

                                        <li>February 2020: Raw genomes (CRAMs/gVCFs), Basic Phenotypes</li>

                                        <li>
                                            September 2020: quality-controlled project level genotype VCF for bi-allelic
                                            autosomal variants
                                        </li>

                                        <li>
                                            February 2021: quality-controlled project level genotype VCF for bi-allelic
                                            chrX variants
                                        </li>

                                        <li>
                                            October 2021: quality-controlled project level genotype VCF for bi-allelic
                                            chrX PAR variants
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="wp-block-group group-text-block">
                                <div className="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow">
                                    <h3 className="wp-block-heading">
                                        Release 3 WGS: <br />
                                        16,905 genomes from 24 cohorts.
                                    </h3>

                                    <ul className="wp-block-list more-space-list">
                                        <li>
                                            Population breakdown: 3,018 African Ancestry, 10,517 Non-Hispanic White
                                            (NHW), 3,296 Hispanic, 74 Unknown/Other
                                        </li>

                                        <li>
                                            February 2021: Raw genomes (CRAMs/gVCFs), Basic Phenotypes, Preview project
                                            level VCF
                                        </li>

                                        <li>
                                            October 2021: quality-controlled project level VCF for bi-allelic autosomal
                                            variants; individual level structural variant calls
                                        </li>

                                        <li>
                                            March 2022: quality-controlled project level VCF for bi-allelic chrX and
                                            chrX PAR variants
                                        </li>

                                        <li>March 2022: GraphTyper and Biograph SV callsets</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="wp-block-group group-text-block">
                                <div className="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow">
                                    <h3 className="wp-block-heading">
                                        Release 4 WGS: <br /> 36,361 genomes from 40 cohorts
                                    </h3>

                                    <ul className="wp-block-list more-space-list">
                                        <li>
                                            Population breakdown for 35,569 unique subjects: 5,218 African Ancestry,
                                            2,791 Asian, 10,398 Hispanic, 16,191 Non-Hispanic White (NHW), and 971
                                            Other/Unknown
                                        </li>

                                        <li>
                                            October 2022: Raw genomes (CRAMs/gVCFs), Basic Phenotypes, Preview project
                                            level genotype VCF
                                        </li>

                                        <li>
                                            October 2022: Harmonized phenotypes from the ADSP-PHC for select cohorts
                                            from the cognitive, fluid biomarker, and neuropathology domains
                                        </li>

                                        <li>
                                            August 2023: project level VCF with full quality control, individual level
                                            structural variant calls
                                        </li>

                                        <li>
                                            December 2023: Harmonized phenotypes from previously released domains as
                                            well as cardiovascular risk and neuroimaging domains
                                        </li>
                                        <li>
                                            Summer 2024: QC’d multi/chrX pVCFs, joint called structural variant calls,
                                            GDS file formats
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="wp-block-group group-text-block">
                                <div className="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow">
                                    <h3 className="wp-block-heading">
                                        Release 5 WGS: <br /> 58,507 genomes from 57 cohorts
                                    </h3>
                                    <ul className="wp-block-list more-space-list">
                                        <li>
                                            Population breakdown for 57,302 unique subjects: 6,875 African Ancestry,
                                            5,523 Asian, 15,390 Hispanic/Latino, 29,107 Non-Hispanic White, and 307
                                            Other/Unknown.
                                        </li>
                                        <li>
                                            Nov 2024: Raw genomes (CRAMs/gVCFs), Basic Phenotypes, Preview project level
                                            genotype VCF, individual level structural variant calls
                                        </li>

                                        <li>
                                            Dec 2024: ADSP-PHC Release 3 including new and updated data for 37,720
                                            participants in select cohorts for cognitive, fluid biomarker,
                                            neuropathology, cardiovascular risk factors, and neuroimaging (DTI, FLAIR,
                                            PET, T1) domains.
                                        </li>

                                        <li>
                                            Spring 2025: project level VCF with full quality control, project level
                                            structural variant calls
                                        </li>

                                        <li>Dec 2025: Quality-controlled pVCF WGS (bi/multi-allelic autosomes)</li>

                                        <li>
                                            March 2026: Additional ADSP R5 WGS quality-controlled (QCed) files,
                                            including autosomal (by consent) and ChrX pVCFs, Genomic Data Structure
                                            (GDS) formatted files; replicate analysis, jointly-called structural
                                            variants, linkage disequilibrium reference panel, and imputation panels;
                                            ADSP-PHC release 4 with new cohorts and harmonized domains
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="wp-block-group group-text-block">
                        <div className="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow">
                            <h3 className="wp-block-heading">
                                <strong>Sequence Data Releases</strong>
                            </h3>
                            <Table id={TABLE.id} columns={TABLE.columns} data={TABLE.data} />
                            <p className="wp-block-paragraph">
                                <em>
                                    * A subset of these participants will have additional harmonized endophenotypes
                                    released in phases by the Phenotype Harmonization Consortium.
                                </em>
                            </p>
                        </div>
                    </div>
                    <div className="wp-block-group group-text-block">
                        <div className="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow">
                            <h3 className="wp-block-heading">
                                <strong>Participant</strong> <strong>Data Availability by Cohort</strong>
                            </h3>
                            <div
                                id="cohTable"
                                className="table"
                                style={{ maxHeight: "600px", overflow: "auto;" }}
                            ></div>
                            <figure id="cohort-table2">
                                <table></table>
                            </figure>
                            <p className="wp-block-paragraph">
                                <em>*counts based off of samples, not participants</em>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default DataSummary;
