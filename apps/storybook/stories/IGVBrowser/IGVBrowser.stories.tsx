import { IGVBrowser, IGVBrowserTrack, VariantReferenceTrack } from "@niagads/igv";
import type { Meta, StoryObj } from "@storybook/react";

const noop = () => {};

const meta: Meta<typeof IGVBrowser> = {
    title: "IGVBrowser/Browser",
    component: IGVBrowser,
    parameters: {
        docs: {
            description: {
                component: `
## IGVBrowser Track Configuration

For instructions on configuring tracks, see the official IGV documentation:

[IGV.js Track Config](https://igv.org/doc/igvjs/#tracks/Tracks/)

You can pass custom tracks using the tracks prop. See the
IGVBrowserTrack type for required fields.

NIAGADS also has the following custom tracks:

* GWAS Summary Statistics: details coming soon
* QTL Summary Statistics: For reading hipFG standardized xQTL track data 
> follow guidelines in the IGV documentation, but add the following:
  * autoscale: true
  * format: bed3+17
  * infoURL: /record
  * if QTL tracks are sharded, provide one file name, substiting $CHR for the chromosome number (not include the "chr") in one file
`,
            },
        },
    },
    argTypes: {
        genome: { control: "text" },
        searchUrl: { control: "text" },
        locus: { control: "text" },
        hideNavigation: { control: "boolean" },
        allowQueryParameters: { control: "boolean" },
        tracks: { control: "object" },
        onBrowserLoad: { action: "onBrowserLoad" },
        onTrackRemoved: { action: "onTrackRemoved" },
        onLocusChanged: { action: "onLocusChanged" },
    },
};

export default meta;

const defaultTracks: IGVBrowserTrack[] = [
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
        searchUrl: "/api/genomics/service/igvbrowser/feature",
        tracks: defaultTracks,
        locus: "ABCA7",
        hideNavigation: false,
        allowQueryParameters: false,
        onBrowserLoad: noop,
        onTrackRemoved: noop,
        onLocusChanged: noop,
    },
    render: (args) => <IGVBrowser {...args} />,
};

export const WithoutNavigation: StoryObj<typeof IGVBrowser> = {
    args: {
        genome: "GRCh38",
        searchUrl: "/api/genomics/service/igvbrowser/feature",
        tracks: defaultTracks,
        locus: "ABCA7",
        hideNavigation: true,
        allowQueryParameters: false,
        onBrowserLoad: noop,
        onTrackRemoved: noop,
        onLocusChanged: noop,
    },
    render: (args) => <IGVBrowser {...args} />,
};
