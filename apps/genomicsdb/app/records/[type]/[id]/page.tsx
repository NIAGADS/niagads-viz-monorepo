import { RecordPage } from "@/components/records/record-page"
import { notFound } from "next/navigation"

interface RecordPageProps {
  params: Promise<{
    type: string
    id: string
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default async function RecordDetailPage({ params, searchParams }: RecordPageProps) {
  const { type, id } = await params
  const resolvedSearchParams = await searchParams

  // Updated valid record types
  const validTypes = ["gene", "variant", "span", "track"]
  if (!validTypes.includes(type)) {
    notFound()
  }

  return <RecordPage type={type} id={id} searchParams={resolvedSearchParams} />
}
