"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EnhancedSearchComponent } from "@/components/enhanced-search-component";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./mobile-menu.css";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    showSearch?: boolean;
    searchPlaceholder?: string;
    searchSuggestions?: string[];
}

export function MobileMenu({
    isOpen,
    onClose,
    showSearch = false,
    searchPlaceholder = "Search genes, variants, regions...",
    searchSuggestions = [],
}: MobileMenuProps) {
    const pathname = usePathname();
    const router = useRouter();

    // Prevent background scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("mobile-menu-open");
        } else {
            document.body.classList.remove("mobile-menu-open");
        }

        return () => {
            document.body.classList.remove("mobile-menu-open");
        };
    }, [isOpen]);

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/") return true;
        if (path !== "/" && pathname.startsWith(path)) return true;
        return false;
    };

    const handleLinkClick = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="mobile-menu-overlay" onClick={onClose} />
            <div className="mobile-menu">
                <div className="mobile-menu-header">
                    <div className="mobile-menu-title">Navigation</div>
                    <button className="mobile-menu-close" onClick={onClose} aria-label="Close menu">
                        <X size={24} />
                    </button>
                </div>

                {showSearch && (
                    <div className="mobile-menu-search">
                        <EnhancedSearchComponent
                            placeholder={searchPlaceholder}
                            suggestions={searchSuggestions}
                            autoRoute={true}
                        />
                    </div>
                )}

                <nav className="mobile-menu-nav" role="navigation" aria-label="Mobile navigation">
                    <Link
                        href="/"
                        className={`mobile-menu-link ${isActive("/") ? "active" : ""}`}
                        onClick={handleLinkClick}
                        aria-current={isActive("/") ? "page" : undefined}
                    >
                        Home
                    </Link>
                    <Link
                        href="/browse-datasets"
                        className={`mobile-menu-link ${isActive("/browse-datasets") ? "active" : ""}`}
                        onClick={handleLinkClick}
                        aria-current={isActive("/browse-datasets") ? "page" : undefined}
                    >
                        Browse Datasets
                    </Link>
                    <Link
                        href="/genome-browser"
                        className={`mobile-menu-link ${isActive("/genome-browser") ? "active" : ""}`}
                        onClick={handleLinkClick}
                        aria-current={isActive("/genome-browser") ? "page" : undefined}
                    >
                        Genome Browser
                    </Link>
                    <Link
                        href="/tutorials"
                        className={`mobile-menu-link ${isActive("/tutorials") ? "active" : ""}`}
                        onClick={handleLinkClick}
                        aria-current={isActive("/tutorials") ? "page" : undefined}
                    >
                        Tutorials
                    </Link>
                    <Link
                        href="/about"
                        className={`mobile-menu-link ${isActive("/about") ? "active" : ""}`}
                        onClick={handleLinkClick}
                        aria-current={isActive("/about") ? "page" : undefined}
                    >
                        About
                    </Link>
                </nav>

                <div className="mobile-menu-footer">
                    <div className="mobile-menu-footer-text">NIAGADS GenomicsDB</div>
                    <div className="mobile-menu-footer-subtext">Alzheimer's Disease Research Portal</div>
                </div>
            </div>
        </>
    );
}
