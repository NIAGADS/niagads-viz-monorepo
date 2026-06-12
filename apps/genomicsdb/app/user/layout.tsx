import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authConfig";
import { UserPageSidebar } from "@/components/UserPageSidebar/UserPageSidebar";

import styles from "./user-layout.module.css";

export default async function UserPageLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <>
            <UserPageSidebar />
            <div className={styles["user-page-content"]}>{children}</div>
        </>
    );
}
