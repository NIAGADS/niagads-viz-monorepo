import type { Metadata } from "next";
import { AccessPage } from "@/components/pages/AccessPage";

export const metadata: Metadata = { title: "Access" };

export default function Page() {
    return <AccessPage section="overview" />;
}
