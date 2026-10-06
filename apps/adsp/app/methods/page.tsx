import type { Metadata } from "next";
import { MethodsPage } from "@/components/pages/MethodsPage";

export const metadata: Metadata = { title: "Pipelines & Methods" };

export default function Page() {
    return <MethodsPage />;
}
