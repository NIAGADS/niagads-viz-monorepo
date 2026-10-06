import type { Metadata } from "next";
import { AccessPage } from "@/components/pages/AccessPage";

export const metadata: Metadata = { title: "How to Apply · Access" };

export default function Page() {
    return <AccessPage section="apply" />;
}
