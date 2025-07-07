"use client";

import { useState, useEffect } from "react";
import { RecordSidebar } from "@/components/records/record-sidebar";
import { GeneRecord } from "@/components/records/gene-record";
import { VariantRecord } from "@/components/records/variant-record";
import { SpanRecord } from "@/components/records/span-record";
import { TrackRecord } from "@/components/records/track-record";
import { LoadingSpinner } from "@niagads/ui";
import { useLoading } from "@/components/loading-context";
import type {
    Record as RecordType,
    GeneRecord as GeneRecordType,
    VariantRecord as VariantRecordType,
    SpanRecord as SpanRecordType,
    TrackRecord as TrackRecordType,
    ContentTabType,
} from "./types";
import { fetchRecordData, ApiError } from "@/lib/api/fetch-record-data";
import { ErrorPage } from "@/components/pages/error-page";

interface RecordPageProps {
    type: string;
    id: string;
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export function RecordPage({ type, id, searchParams }: RecordPageProps) {
    const [record, setRecord] = useState<RecordType | null>(null);
    const [activeSection, setActiveSection] = useState<string>("overview");
    const [activeContentTab, setActiveContentTab] = useState<ContentTabType | undefined>();
    const { isLoading, setLoading } = useLoading();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [recordError, setRecordError] = useState<ApiError | null>(null);

    // Add this function before the useEffect
    const handleSectionChange = (section: string) => {
        setActiveSection(section);

        // Set default content tab based on section
        let defaultTab: ContentTabType | undefined;
        switch (section) {
            case "niagads-gwas":
                defaultTab = "niagads-alzheimers";
                break;
            case "gwas-catalog":
                defaultTab = "gwas-alzheimers";
                break;
            case "link-outs":
                defaultTab = "related-gene-records";
                break;
            case "function-prediction":
                defaultTab = "gene-ontology";
                break;
            case "pathways-interactions":
                defaultTab = "pathways";
                break;
            default:
                defaultTab = undefined;
        }

        if (defaultTab) {
            setActiveContentTab(defaultTab);
        } else {
            setActiveContentTab(undefined);
        }
    };

    // Fetch record data based on type and ID
    useEffect(() => {
        setLoading(true);
        setRecord(null);
        setRecordError(null);

        const fetch = async () => {
            const result = await fetchRecordData(type, id);

            if ("status" in result) {
                // It's an ApiError
                setRecordError(result);
                setLoading(false);
                return;
            }

            // Valid record
            setRecord(result);
            setLoading(false);
        };

        fetch();

        const urlSection = searchParams.section as string;
        const urlTab = searchParams.tab as string;

        if (urlSection) {
            setActiveSection(urlSection);

            if (!urlTab) {
                let defaultTab: ContentTabType | undefined;
                switch (urlSection) {
                    case "niagads-gwas":
                        defaultTab = "niagads-alzheimers";
                        break;
                    case "gwas-catalog":
                        defaultTab = "gwas-alzheimers";
                        break;
                    case "link-outs":
                        defaultTab = "related-gene-records";
                        break;
                    case "function-prediction":
                        defaultTab = "gene-ontology";
                        break;
                    case "pathways-interactions":
                        defaultTab = "pathways";
                        break;
                }
                if (defaultTab) setActiveContentTab(defaultTab);
            }
        } else {
            setActiveSection("overview");
        }

        if (urlTab) {
            setActiveContentTab(urlTab as ContentTabType);
        }
    }, [type, id, setLoading]);

    // Handle content tab changes
    const handleContentTabChange = (tab: ContentTabType) => {
        setActiveContentTab(tab);
    };

    // Render the appropriate record component based on type
    const renderRecord = () => {
        if (isLoading) {
            return <LoadingSpinner message={`Loading ${type} record...`} />;
        }

        if (recordError) {
            return <ErrorPage status={recordError.status} detail={recordError.detail} />;
        }
        if (!record) {
            return <div>Record not found</div>;
        }

        switch (type) {
            case "gene":
                return (
                    <GeneRecord
                        record={record as GeneRecordType}
                        activeSection={activeSection}
                        activeContentTab={activeContentTab}
                        onContentTabChange={handleContentTabChange}
                    />
                );
            case "variant":
                return <VariantRecord record={record as VariantRecordType} activeSection={activeSection} />;
            case "span":
                return <SpanRecord record={record as SpanRecordType} activeSection={activeSection} />;
            case "track":
                return <TrackRecord record={record as TrackRecordType} activeSection={activeSection} />;
            default:
                return <div>Unknown record type</div>;
        }
    };

    return (
        <div className="record-page-container">
            <RecordSidebar
                type={type}
                record={record}
                activeSection={activeSection}
                setActiveSection={handleSectionChange}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className={`record-content ${sidebarOpen ? "with-sidebar" : "sidebar-collapsed"}`}>
                {renderRecord()}
            </div>
        </div>
    );
}
