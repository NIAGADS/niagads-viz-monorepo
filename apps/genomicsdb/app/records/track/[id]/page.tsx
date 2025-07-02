import { RecordPage } from "@/components/records/record-page";
import { notFound } from "next/navigation";

interface RecordPageProps {
    params: Promise<{
        type: string;
        id: string;
    }>;
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>;
}

export default async function RecordDetailPage({ params, searchParams }: RecordPageProps) {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;

    return <RecordPage type={'track'} id={id} searchParams={resolvedSearchParams} />;
}
