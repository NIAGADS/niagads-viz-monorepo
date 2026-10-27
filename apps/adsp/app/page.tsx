import { HomePage } from "@/components/pages/HomePage";

export const revalidate = 3600;

export default async function Page() {
    return <HomePage />;
}
