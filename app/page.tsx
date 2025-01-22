"use client";
import dynamic from "next/dynamic";
// import { MemoIGVBrowser as GenomeBrowser } from "@/components/IGVBrowser/IGVBrowser";

const GenomeBrowser = dynamic(
    () =>
        import("@/components/IGVBrowser/IGVBrowser").then(
            (mod) => mod.MemoIGVBrowser
        ),
    {
        ssr: false,
    }
);

const tracks = [
    /*  {
        url: "/service/track/variant",
        name: "ADSP R4 Variants",
        type: "variant_service",
        format: "webservice",
        visibilityWindow: 1000000,
        queryable: true,
        description:
            "Variants from the Alzheimer''s Disease Sequencing Project (ADSP) 36K R4 whole genome sequencing effort - INDELs and SNVs that passed the ADSP biallelic quality control (QC) criteria. Variants are annotated by the ADSP Annotation Pipeline.",
        id: "ADSP_R4",
        order: 1,
        infoURL: "/record",
    }, */
    {
        name: "big-bed -> filer bed test",
        description: "testing bigBed/narrowpeak, as filer bed",
        id: "BB_TEST_CONVERTED",
        type: "annotation",
        format: "narrowpeak",
        url: "https://tf.lisanwanglab.org/GADB/Annotationtracks/ENCODE/data/DNase-seq/broadpeak/hg38/ENCFF195KQC.bed.gz",
        indexURL:
            "https://tf.lisanwanglab.org/GADB/Annotationtracks/ENCODE/data/DNase-seq/broadpeak/hg38/ENCFF195KQC.bed.gz.tbi",
    },
    {
        description:
            "summary statistics from meta-analysis results obtained in the stage 1 GWAS study, including genotyped and imputed data (11,480,632 variants, phase 1 integrated release 3, March 2012) of 21,982 Alzheimer's disease cases and 41,944 cognitively normal controls. The meta-analysis examined SNPs genotyped or imputed in at least 30% of the AD cases and 30% of the control samples across all datasets. (Lifted Over from GRCh37 to GRCh38)",
        url: "/service/track/gwas",
        name: "IGAP Rare Variants: Stage 1 (GRCh38) (Kunkle et al. 2019)",
        type: "gwas_service",
        format: "webservice",
        visibilityWindow: 1000000,
        id: "NG00075_GRCh38_STAGE1",
        infoURL: "/record",
    },
    {
        id: "NGCRP18733",
        name: "NG00102_Cruchaga_pQTLs Brain pQTL pQTL SNP significant associations",
        url: "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/Brain/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_Brain_all_protein_SNP_significant.bed.gz",
        description:
            "NG00102_Cruchaga_pQTLs Brain pQTL pQTL SNP significant associations (bed3+17 qtl) [Life stage: Adult]",
        indexURL:
            "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/Brain/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_Brain_all_protein_SNP_significant.bed.gz.tbi",
        type: "qtl",
        format: "bed3+17",
        infoURL: "/record",
        autoscale: true,
    },
    {
        id: "NGCRP18734",
        name: "NG00102_Cruchaga_pQTLs Brain pQTL pQTL INDEL significant associations",
        url: "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/Brain/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_Brain_all_protein_OTHER_significant.bed.gz",
        description:
            "NG00102_Cruchaga_pQTLs Brain pQTL pQTL INDEL significant associations (bed3+17 qtl) [Life stage: Adult]",
        indexURL:
            "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/Brain/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_Brain_all_protein_OTHER_significant.bed.gz.tbi",
        type: "qtl",
        format: "bed3+17",
        infoURL: "/record",
        autoscale: true,
    },
    {
        id: "NGCRP18735",
        name: "NG00102_Cruchaga_pQTLs Cerebrospinal fluid pQTL pQTL SNP significant associations",
        url: "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/CSF/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_CSF_all_protein_SNP_significant.bed.gz",
        description:
            "NG00102_Cruchaga_pQTLs Cerebrospinal fluid pQTL pQTL SNP significant associations (bed3+17 qtl) [Life stage: Adult]",
        indexURL:
            "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/CSF/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_CSF_all_protein_SNP_significant.bed.gz.tbi",
        type: "qtl",
        format: "bed3+17",
        infoURL: "/record",
        autoscale: true,
    },
    {
        id: "NGCRP18736",
        name: "NG00102_Cruchaga_pQTLs Cerebrospinal fluid pQTL pQTL INDEL significant associations",
        url: "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/CSF/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_CSF_all_protein_OTHER_significant.bed.gz",
        description:
            "NG00102_Cruchaga_pQTLs Cerebrospinal fluid pQTL pQTL INDEL significant associations (bed3+17 qtl) [Life stage: Adult]",
        indexURL:
            "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/CSF/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_CSF_all_protein_OTHER_significant.bed.gz.tbi",
        type: "qtl",
        format: "bed3+17",
        infoURL: "/record",
        autoscale: true,
    },
    {
        id: "NGCRP18737",
        name: "NG00102_Cruchaga_pQTLs Plasma pQTL pQTL SNP significant associations",
        url: "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/Plasma/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_Plasma_all_protein_SNP_significant.bed.gz",
        description:
            "NG00102_Cruchaga_pQTLs Plasma pQTL pQTL SNP significant associations (bed3+17 qtl) [Life stage: Adult]",
        indexURL:
            "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/Plasma/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_Plasma_all_protein_SNP_significant.bed.gz.tbi",
        type: "qtl",
        format: "bed3+17",
        infoURL: "/record",
        autoscale: true,
    },
    {
        id: "NGCRP18738",
        name: "NG00102_Cruchaga_pQTLs Plasma pQTL pQTL INDEL significant associations",
        url: "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/Plasma/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_Plasma_all_protein_OTHER_significant.bed.gz",
        description:
            "NG00102_Cruchaga_pQTLs Plasma pQTL pQTL INDEL significant associations (bed3+17 qtl) [Life stage: Adult]",
        indexURL:
            "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/NG00102/Plasma/pQTL/significant/bed3plus17_qtl/hg38/formatted_output_Plasma_all_protein_OTHER_significant.bed.gz.tbi",
        type: "qtl",
        format: "bed3+17",
        infoURL: "/record",
        autoscale: true,
    },
];

export default function Home() {
    return (
        <GenomeBrowser
            featureSearchURI="/service/track/feature?id="
            genome="hg38"
            tracks={tracks}
        />
    );
}
