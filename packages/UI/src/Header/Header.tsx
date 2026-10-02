import React, { ReactNode, useState } from "react";
import { Menu } from "lucide-react";

import { MobileMenu, type MobileMenuProps } from "../client/MobileMenu";

import styles from "./header.module.css";

export interface NavigationMenuLink {
    text: string;
    url: string;
    active?: boolean;
}

export type HeaderMobileMenuConfig = Pick<MobileMenuProps, "title" | "footer">;

export interface HeaderProps {
    logo: ReactNode;
    logoHref?: string;
    links: NavigationMenuLink[];
    /** Optional search component, shared by the desktop header and mobile menu. */
    search?: ReactNode;
    /** Optional authentication or account menu, displayed after navigation links. */
    userMenu?: ReactNode;
    children?: ReactNode;
    /** Supply a router link component (for example, Next.js Link) instead of native anchors. */
    linkComponent?: React.ElementType<React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>;
    /** Enable mobile navigation using the same links and router as the desktop menu. */
    mobileMenu?: boolean;
    /** Optional mobile menu title and footer; does not enable the menu. */
    mobileMenuConfig?: HeaderMobileMenuConfig;
}

export const Header = ({
    logo,
    logoHref = "/",
    links,
    search,
    userMenu,
    children,
    linkComponent: Link = "a",
    mobileMenu = false,
    mobileMenuConfig,
}: HeaderProps) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className={`${styles.header} ${mobileMenu ? styles["has-mobile-menu"] : ""}`}>
                <div className={`${styles["logo-container"]} ${search ? styles["with-search"] : ""}`}>
                    <div className={styles.logo}>
                        <Link href={logoHref}>{logo}</Link>
                    </div>
                    {search && <div className={styles["header-search"]}>{search}</div>}
                </div>
                {mobileMenu && (
                    <button
                        type="button"
                        className={styles["mobile-menu-button"]}
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <Menu size={24} aria-hidden="true" />
                    </button>
                )}
                <nav className={styles["main-nav"]} aria-label="Main navigation">
                    {links.map((link) => (
                        <Link
                            key={`${link.text}-${link.url}`}
                            href={link.url}
                            className={`${styles["nav-link"]} ${link.active ? styles.active : ""}`}
                            aria-current={link.active ? "page" : undefined}
                        >
                            {link.text}
                        </Link>
                    ))}
                    {userMenu}
                    {children}
                </nav>
            </header>
            {mobileMenu && (
                <MobileMenu
                    {...mobileMenuConfig}
                    search={search}
                    links={links}
                    linkComponent={Link}
                    isOpen={menuOpen}
                    onClose={() => setMenuOpen(false)}
                />
            )}
        </>
    );
};
