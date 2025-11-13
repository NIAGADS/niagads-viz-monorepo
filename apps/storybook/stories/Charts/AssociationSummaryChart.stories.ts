import type { Meta, StoryObj } from "@storybook/react";

import { AssociationSummaryChart } from "@niagads/charts";

const meta: Meta<typeof AssociationSummaryChart> = {
    title: "Charts/AssociationSummary",
    component: AssociationSummaryChart,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AssociationSummaryChart>;

export const Default: Story = {
    args: {
        id: "test",
        base_url: "https://api.niagads.org/genomics/record/gene/ENSG00000130203/associations",
        trait: "AD",
        source: "GWAS",
    },
};
