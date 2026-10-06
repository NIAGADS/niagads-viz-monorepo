import { HomePage } from "@/components/pages/HomePage";
import { getLiveStats } from "@/lib/live";

export const revalidate = 3600;

export default async function Page() {
    const live = await getLiveStats();
    return <HomePage live={live} />;
}
