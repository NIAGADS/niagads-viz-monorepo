import { RecordPage } from "@/components/records/record-page";

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

    return <RecordPage type={'gene'} id={id} searchParams={resolvedSearchParams} />;
}
