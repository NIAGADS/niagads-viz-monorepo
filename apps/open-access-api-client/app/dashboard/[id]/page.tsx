import Dashboard from "../../ask/Dashboard";

export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <Dashboard id={id} />;
}
