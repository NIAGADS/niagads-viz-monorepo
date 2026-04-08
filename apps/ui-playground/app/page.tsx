import Link from "next/link";

export default function Home() {
    return (
        <main style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
            <h1>UI Playground</h1>
            <ul style={{ fontSize: "1.2rem", lineHeight: 2 }}>
                <li>
                    <Link href="/table-playground/base">Table Playground: Base</Link>
                </li>
                <li>
                    <Link href="/table-playground/external-filters">Table Playground: External Filters</Link>
                </li>
                <li>
                    <Link href="/variant-track">Variant Track Playground (APOE)</Link>
                </li>
            </ul>
        </main>
    );
}
