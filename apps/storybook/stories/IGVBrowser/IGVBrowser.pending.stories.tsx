import { IGVBrowser, IGVBrowserTrack, VariantReferenceTrack } from "@niagads/igv";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const noop = () => {};

const meta: Meta<typeof IGVBrowser> = {
    title: "IGVBrowser/Browser",
    component: IGVBrowser,
    parameters: {
        docs: {
            description: {
                component: `
TBA - link to README
`,
            },
        },
    },
    argTypes: {
        genome: { control: "text" },
        searchUrl: { control: "text" },
        locus: { control: "text" },
        hideNavigation: { control: "boolean" },
        trackConfig: { control: "object" },
        onBrowserLoad: { action: "onBrowserLoad" },
        onTrackRemoved: { action: "onTrackRemoved" },
        onLocusChanged: { action: "onLocusChanged" },
    },
};

export default meta;

const trackConfig: IGVBrowserTrack[] = [
    VariantReferenceTrack,
    {
        id: "NGFGXQTL0002",
        name: "Knight-ADRC-mQTL-PC",
        url: "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/ADSP_FunGen_xQTL/v1/Knight-ADRC/mQTL/qvalue_significant/bed3plus17_qtl/hg38/FunGenADv1.Knight-ADRC.mQTL.PC.NGFGXQTL0002_v1_$CHR_snp_qsig.SNP_qvalue_significant.20250901.bed.gz",
        description: "",
        infoURL: "/record",
        format: "bed3+17",
        type: "qtl",
        indexURL:
            "https://tf.lisanwanglab.org/GADB/FILER2/Annotationtracks/ADSP_FunGen_xQTL/v1/Knight-ADRC/mQTL/qvalue_significant/bed3plus17_qtl/hg38/FunGenADv1.Knight-ADRC.mQTL.PC.NGFGXQTL0002_v1_$CHR_snp_qsig.SNP_qvalue_significant.20250901.bed.gz.tbi",
        autoscale: true,
    },
];

export const WithNavigation: StoryObj<typeof IGVBrowser> = {
    args: {
        genome: "GRCh38",
        defaultTracks: [trackConfig[1]],
        referenceTracks: [VariantReferenceTrack],
        locus: "ABCA7",
        hideNavigation: false,
        onBrowserLoad: noop,
        onTrackRemoved: noop,
        onLocusChanged: noop,
    },
    render: (args) => <IGVBrowser {...args} />,
};

export const WithoutNavigation: StoryObj<typeof IGVBrowser> = {
    args: {
        genome: "GRCh38",
        trackConfig: trackConfig,
        locus: "ABCA7",
        hideNavigation: true,
        onBrowserLoad: noop,
        onTrackRemoved: noop,
        onLocusChanged: noop,
    },
    render: (args) => <IGVBrowser {...args} />,
};
