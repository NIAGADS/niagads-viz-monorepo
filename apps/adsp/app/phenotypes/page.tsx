import type { Metadata } from "next";
import { PhenotypesPage } from "@/components/pages/PhenotypesPage";

export const metadata: Metadata = { title: "Phenotypes" };

export default function Page() {
    return <PhenotypesPage />;
}
