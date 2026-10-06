import type { Metadata } from "next";
import { AccessPage } from "@/components/pages/AccessPage";

export const metadata: Metadata = { title: "DSS & Gen3 · Access" };

export default function Page() {
    return <AccessPage section="dss-gen3" />;
}
