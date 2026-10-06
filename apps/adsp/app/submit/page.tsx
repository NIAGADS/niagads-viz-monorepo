import type { Metadata } from "next";
import { SubmitPage } from "@/components/pages/SubmitPage";

export const metadata: Metadata = { title: "Submit Data" };

export default function Page() {
  return <SubmitPage />;
}
