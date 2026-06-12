import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authConfig";
import { UserPageSidebar } from "@/components/UserPageSidebar/UserPageSidebar";

export default async function UserPageLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <>
            <UserPageSidebar />
            <div>{children}</div>
        </>
    );
}