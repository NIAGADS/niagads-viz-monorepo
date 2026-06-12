import { getPublicUrl } from "@/lib/utils";
import Link from "next/link";

import styles from "./user-page-sidebar.module.css";

export const UserPageSidebar = () => {
    return (
        <aside className={[styles["sidebar"]].filter(Boolean).join(" ")}>
            <Link href={`${getPublicUrl()}/user/profile`}>Profile</Link>
            <Link href={`${getPublicUrl()}/user/bookmarks`}>Bookmarks</Link>
        </aside>
    );
};
