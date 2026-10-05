import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { NewsBrowser, type NewsItem } from "@niagads/ui/client";

// Illustrative fixtures, not a live NIAGADS news feed.
const news: NewsItem[] = [
    {
        date: "2026-10-01",
        news_type: "Data release",
        resources: ["NIAGADS DSS", "ADSP"],
        title: "New ADSP whole-genome sequencing data available",
        summary: "A new release is available through the controlled-access repository.",
        body: "<p>Visit NIAGADS DSS to review the release documentation and access requirements.</p>",
        url: "https://dss.niagads.org/",
    },
    {
        date: "2026-09-24",
        news_type: "Patch / correction",
        resources: ["NIAGADS Open Access"],
        title: "GenomicsDB annotation correction",
        summary: "Updated annotations and a description of affected records.",
        body: "The release notes describe the affected records and corrected annotations.",
        url: "https://www.niagads.org/",
    },
    {
        date: "2026-09-18",
        news_type: "Event / training",
        resources: ["NIAGADS DSS", "NIAGADS Open Access"],
        title: "Webinar: finding and accessing NIAGADS data",
        summary: "Learn how to discover datasets and request access.",
        body: "The webinar covers dataset discovery, access applications, and open-access resources.",
    },
    {
        date: "2026-08-12",
        news_type: "Data release",
        resources: ["NIAGADS Open Access"],
        title: "New open-access datasets",
        summary: "Explore newly added datasets and supporting documentation.",
        url: "https://www.niagads.org/",
    },
    {
        date: "2025-11-07",
        news_type: "Documentation",
        resources: ["NIAGADS DSS"],
        title: "Updated data access guide",
        summary: "A step-by-step guide to preparing a data access application.",
        body: "Review the application checklist before submitting a request.",
    },
    {
        date: "2025-06-20",
        news_type: "Data release",
        resources: ["ADSP"],
        title: "ADSP project update",
        summary: "An overview of project resources and releases.",
    },
    {
        date: "2024-12-03",
        news_type: "Event / training",
        resources: ["NIAGADS Open Access"],
        title: "Training materials available",
        summary: "Browse materials from the latest data discovery training.",
    },
];

const meta = {
    title: "UI/Client/NewsBrowser",
    component: NewsBrowser,
    tags: ["autodocs"],
    parameters: { layout: "padded" },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 692, margin: "0 auto" }}>
                <Story />
            </div>
        ),
    ],
    args: { news },
    argTypes: {
        news: { control: "object", description: "Plain-text news entries with publication dates." },
        heading: { control: "text" },
        style: { control: false },
    },
} satisfies Meta<typeof NewsBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { news: [] } };
const longSummary = "A new release supports research into Alzheimer's disease. ".repeat(8).trim();

export const SummaryExpansion: Story = {
    args: {
        news: [
            {
                date: "2026-10-01",
                title: "Linked announcement",
                summary: longSummary,
                body: "<p>Full linked article should stay on the original site.</p>",
                url: "https://dss.niagads.org/",
            },
            {
                date: "2026-09-30",
                title: "Local announcement",
                summary: "A short preview of the local article.",
                body: "<p>Full local article is available here.</p>",
            },
            {
                date: "2026-09-29",
                title: "Short linked announcement",
                summary: "A short summary needs no expansion.",
                body: "<p>Another linked article should stay on the original site.</p>",
                url: "https://dss.niagads.org/",
            },
        ],
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const articles = canvas.getAllByRole("article");
        const linked = within(articles[0]);
        const local = within(articles[1]);
        const preview = articles[0].querySelector("p")!;
        await expect(preview.textContent!.length).toBeLessThanOrEqual(240);
        await expect(preview.textContent).toMatch(/…$/);
        await expect(linked.getByText(longSummary)).not.toBeVisible();
        await userEvent.click(linked.getByText("Read more", { exact: false }));
        await expect(linked.getByText(longSummary)).toBeVisible();
        await expect(canvas.queryByText("Full linked article should stay on the original site.")).toBeNull();
        await userEvent.click(local.getByText("Read more", { exact: false }));
        await expect(local.getByText("Full local article is available here.")).toBeVisible();
        await expect(articles[2].querySelector("details")).toBeNull();
        await expect(canvas.queryByText("Another linked article should stay on the original site.")).toBeNull();
    },
};
export const Mobile: Story = {
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 340 }}>
                <Story />
            </div>
        ),
    ],
};
export const FilterAndExpand: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole("status")).toHaveTextContent("7 news items");
        await userEvent.selectOptions(canvas.getByLabelText("Resource"), "NIAGADS Open Access");
        await userEvent.selectOptions(canvas.getByLabelText("Type"), "Patch / correction");
        await userEvent.selectOptions(canvas.getByLabelText("Year"), "2026");
        await expect(canvas.getByRole("status")).toHaveTextContent("1 news item · Newest first");
        await userEvent.type(canvas.getByLabelText("Search"), "no matching news");
        await expect(canvas.getByText("No news matches these filters.")).toBeVisible();
        await userEvent.click(canvas.getByRole("button", { name: "Clear filters" }));
        await expect(canvas.getByRole("status")).toHaveTextContent("7 news items");
        await expect(canvas.getByLabelText("Search")).toHaveValue("");
        await expect(canvas.getByLabelText("Resource")).toHaveValue("All resources");
        await expect(canvas.getByLabelText("Type")).toHaveValue("All types");
        await expect(canvas.getByLabelText("Year")).toHaveValue("All years");
        await userEvent.click(
            canvas.getAllByText("Read more", { exact: false }).find((element) => element.tagName === "SUMMARY")!
        );
        await expect(
            canvas.getByText("The webinar covers dataset discovery, access applications, and open-access resources.")
        ).toBeVisible();
    },
};
