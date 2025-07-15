import { RecordPage } from "@/components/records/record-page";

interface PageProps {
    params: Promise<{
        type: string;
        id: string;
    }>;
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>;
}

export default async function RecordDetailPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;

    return <RecordPage type={"variant"} id={id} searchParams={resolvedSearchParams} />;
}
