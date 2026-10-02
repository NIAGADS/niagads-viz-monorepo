"use client";

import { ActionMenu, Header as UIHeader } from "@niagads/ui/client";
import { signIn, signOut, useSession } from "next-auth/react";

import { EnhancedSearch } from "@/components/EnhancedSearch";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { getPublicUrl } from "@/lib/utils";
import logo from "@public/genomicsdb_logo.svg";
import styles from "./user-menu.module.css";
import { usePathname } from "next/navigation";

const navigationLinks = [
    { text: "Browse Datasets", url: "/browse-datasets" },
    { text: "Genome Browser", url: "/genome-browser" },
    { text: "Tutorials", url: "/tutorials" },
    { text: "About", url: "/about" },
];

export const Header = () => {
    const pathname = usePathname();

    return (
        <UIHeader
            logo={<Image width={200} height={60} src={logo} alt="Niagads GenomicsDB" loading="eager" />}
            links={navigationLinks.map((link) => ({
                ...link,
                active: pathname === link.url || pathname.startsWith(`${link.url}/`),
                url: `${getPublicUrl(true)}${link.url}`,
            }))}
            linkComponent={Link}
            mobileMenu
            mobileMenuConfig={{
                footer: <div className={styles.mobileMenuFooter}>NIAGADS GenomicsDB</div>,
            }}
            search={<EnhancedSearch placeholder="Search for genes, tracks, regions..." autoRoute={true} />}
            userMenu={<UserMenu />}
        />
    );
};

const UserMenu = () => {
    const { data: session } = useSession();

    return session ? (
        <ActionMenu label={`${session.user?.name}`} icon={User}>
            <div className={styles.userMenu}>
                <Link className={styles.userMenuItem} href={`${getPublicUrl(true)}/user/profile`}>
                    Profile
                </Link>
                <button type="button" className={styles.userMenuItem} onClick={() => signOut()}>
                    Sign Out
                </button>
            </div>
        </ActionMenu>
    ) : (
        <button type="button" onClick={() => signIn("cognito")} className={styles.login}>
            Log In
        </button>
    );
};
