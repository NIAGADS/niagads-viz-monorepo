import { SequencingRoundsPage } from "@/components/pages/SequencingRounds/SequencingRoundsPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sequencing Rounds" };

export default function Page() {
    return <SequencingRoundsPage />;
}
