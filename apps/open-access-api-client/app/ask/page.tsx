import type { Metadata } from "next";
import Chat from "./Chat";

export const metadata: Metadata = {
    title: "ASK NIAGADS",
};

export default function AskPage() {
    return <Chat />;
}
