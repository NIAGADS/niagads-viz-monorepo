"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@public/genomicsdb_logo.svg";
import { usePathname, useRouter } from "next/navigation";
import { EnhancedSearch } from "./EnhancedSearch";
import "./header.css";
import { getPublicUrl } from "@/lib/utils";

interface HeaderProps {
    onMenuToggle: () => void;
    showSearch?: boolean;
}

export function Header({ onMenuToggle, showSearch = true }: HeaderProps) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/") return true;
        if (path !== "/" && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="header">
            <div className="logo-container">
                <div className="logo">
                    <Link className="active-menu-item" href="/">
                        <figure>
                            <Image width={200} height={60} src={logo} alt="Niagads GenomicsDB logo" />
                        </figure>
                    </Link>
                </div>

                {showSearch && (
                    <div className="header-search">
                        <EnhancedSearch placeholder={"Search for genes, tracks, regions..."} autoRoute={true} />
                    </div>
                )}
            </div>

            <button
                className="mobile-menu-button"
                onClick={onMenuToggle}
                aria-label="Toggle menu"
                aria-expanded="false"
            >
                <Menu size={24} />
            </button>

            <nav className="main-nav" role="navigation" aria-label="Main navigation">
                <Link
                    href={`${getPublicUrl(true)}/browse-datasets`}
                    className={`nav-link ${isActive("/browse-datasets") ? "active" : ""}`}
                    aria-current={isActive("/browse-datasets") ? "page" : undefined}
                >
                    Browse Datasets
                </Link>
                <Link
                    href={`${getPublicUrl(true)}/genome-browser`}
                    className={`nav-link ${isActive("/genome-browser") ? "active" : ""}`}
                    aria-current={isActive("/genome-browser") ? "page" : undefined}
                >
                    Genome Browser
                </Link>
                <Link
                    href={`${getPublicUrl(true)}/tutorials`}
                    className={`nav-link ${isActive("/tutorials") ? "active" : ""}`}
                    aria-current={isActive("/tutorials") ? "page" : undefined}
                >
                    Tutorials
                </Link>
                <Link
                    href={`${getPublicUrl(true)}/about`}
                    className={`nav-link ${isActive("/about") ? "active" : ""}`}
                    aria-current={isActive("/about") ? "page" : undefined}
                >
                    About
                </Link>
            </nav>
        </header>
    );
}
