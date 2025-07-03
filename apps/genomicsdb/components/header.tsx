"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@public/genomicsdb_logo.svg";
import { usePathname, useRouter } from "next/navigation";
import { EnhancedSearchComponent } from "./enhanced-search-component";
import "./header.css";

interface HeaderProps {
    onMenuToggle: () => void;
    showSearch?: boolean;
    searchPlaceholder?: string;
    searchSuggestions?: string[];
}

export function Header({
    onMenuToggle,
    showSearch = false,
    searchPlaceholder = "Search genes, variants, regions...",
    searchSuggestions = [],
}: HeaderProps) {
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
                        <EnhancedSearchComponent
                            placeholder={searchPlaceholder}
                            suggestions={searchSuggestions}
                            showTypeHints={true}
                            autoRoute={true}
                        />
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
                    href="/browse-datasets"
                    className={`nav-link ${isActive("/browse-datasets") ? "active" : ""}`}
                    aria-current={isActive("/browse-datasets") ? "page" : undefined}
                >
                    Browse Datasets
                </Link>
                <Link
                    href="/genome-browser"
                    className={`nav-link ${isActive("/genome-browser") ? "active" : ""}`}
                    aria-current={isActive("/genome-browser") ? "page" : undefined}
                >
                    Genome Browser
                </Link>
                <Link
                    href="/tutorials"
                    className={`nav-link ${isActive("/tutorials") ? "active" : ""}`}
                    aria-current={isActive("/tutorials") ? "page" : undefined}
                >
                    Tutorials
                </Link>
                <Link
                    href="/about"
                    className={`nav-link ${isActive("/about") ? "active" : ""}`}
                    aria-current={isActive("/about") ? "page" : undefined}
                >
                    About
                </Link>
            </nav>
        </header>
    );
}
