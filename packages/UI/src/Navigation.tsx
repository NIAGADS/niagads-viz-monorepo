import React, { ReactNode } from "react";

import { ThemeVariant } from "./types";
import { renderInfoIcon } from "./Alert";
import styles from "./styles/navigation.module.css";

/** TODO:
 * theme-based variants
 * optional user menu
 * optional search bar
 * responsive
 * */

export interface MenuItemConfig {
    label: string;
    target?: React.HTMLAttributeAnchorTarget;
    href: string;
}

interface BrandItemConfig extends MenuItemConfig {
    logo?: ReactNode;
}

export interface NavigationConfig {
    brand: BrandItemConfig;
    items: MenuItemConfig[];
    publicHostUrl?: string;
}

interface NavigationProps {
    variant?: ThemeVariant;
    config?: NavigationConfig;
    children?: ReactNode;
    bannerMsg?: string;
}

const buildRouterLink = (url: string, hostUrl: string | undefined) => {
    if (url.startsWith("http")) {
        return url;
    }
    // otherwise build the router link
    const href = hostUrl ? `${hostUrl}${url.startsWith("/") ? url : "/" + url}` : url;
    return href;
};

const renderMenuLink = (item: MenuItemConfig, hostUrl: string | undefined, variant: string, key: string) => (
    <a
        key={key}
        className={`${styles["ui-nav-link"]} ${styles[variant]}`}
        href={buildRouterLink(item.href, hostUrl)}
        target={item.target}
    >
        {item.label}
    </a>
);

const MenuItem = ({
    item,
    index,
    hostUrl,
    variant,
}: {
    item: MenuItemConfig;
    index: number;
    hostUrl: string | undefined;
    variant: string;
}) => {
    return (
        <li key={`nav-menu-list-item_${index}`}>
            {renderMenuLink(item, hostUrl, variant, `nav-menu-item-link_${index}`)}
        </li>
    );
};

const MobileMenu = ({
    items,
    hostUrl,
    variant,
}: {
    items: MenuItemConfig[];
    hostUrl: string | undefined;
    variant: string;
}) => {
    return (
        <div className={styles["ui-nav-mobile"]}>
            {items && (
                <div className={styles["ui-nav-mobile-menu"]}>
                    {items.map((item, index) =>
                        renderMenuLink(item, hostUrl, variant, `nav-mobile-menu-link_${index}`)
                    )}
                </div>
            )}
        </div>
    );
};

const MobileMenuButton = ({}) => (
    <div className="-mr-2 flex md:hidden">
        <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
            aria-controls="mobile-menu"
            aria-expanded="false"
        >
            <span className="absolute -inset-0.5"></span>
            <span className="sr-only">Open main menu</span>
            <svg
                className="block size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg
                className="hidden size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);

const renderNavigationFromConfig = (variant: ThemeVariant, { items, brand, publicHostUrl }: NavigationConfig) => (
    <>
        {brand && (
            <a href={brand.href} target={brand.target} className={styles["ui-nav-brand"]}>
                {brand.logo && brand.logo}
                <span className={`${styles["ui-nav-brand-label"]} ${styles[variant]}`}>{brand.label}</span>
            </a>
        )}

        <div className={styles["ui-nav-item-container"]}>
            {items && (
                <ul className={styles["ui-nav-item-list"]}>
                    {items.map((item, index) => (
                        <MenuItem
                            key={`ui-menu-item-${index}`}
                            index={index}
                            item={item}
                            hostUrl={publicHostUrl}
                            variant={variant}
                        />
                    ))}
                </ul>
            )}
        </div>
        {/*<MobileMenuButton />*/}
        <MobileMenu items={items} hostUrl={publicHostUrl} variant={variant} />
    </>
);

const renderBanner = (message: string) => (
    <div className={styles["ui-nav-banner"]}>
        {renderInfoIcon()} {message}
    </div>
);

export const Navigation = ({ variant = "light", children, config, bannerMsg }: NavigationProps) => {
    return (
        <>
            <nav className={`${styles["ui-nav"]} ${styles[variant]}`}>
                {bannerMsg && renderBanner(bannerMsg)}
                <div className={styles["ui-nav-inner-container"]}>
                    {config ? renderNavigationFromConfig(variant, config) : children}
                </div>
            </nav>
        </>
    );
};
