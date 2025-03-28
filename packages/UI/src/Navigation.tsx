import React, { ReactNode } from "react";

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
    variant?: "primary" | "secondary" | "white" | "default";
    items: MenuItemConfig[];
    publicHostUrl?: string;
}

const MenuItem = ({ item, index, hostUrl, variant }: { item: MenuItemConfig; index: number; hostUrl: string | undefined, variant: string }) => {
    const __buildRouterLink = (url: string) => {
        if (url.startsWith("http")) {
            return url;
        }
        // otherwise build the router link
        const href = hostUrl ? `${hostUrl}${url.startsWith('/') ? url : '/' + url}` : url;
        return href;
    };

    return (
        <li key={`nav-menu-item_${index}`}>
            <a className={`ui-nav-link ${variant}`} href={__buildRouterLink(item.href)} target={item.target}>
                {item.label}
            </a>
        </li>
    );
};

export const Navigation = ({ variant="white", items, brand, publicHostUrl }: NavigationConfig) => {
    return (
        <nav className={`ui-nav ${variant}`}>
            <div className="ui-nav-inner-container">
                {brand && (
                    <a href={brand.href} target={brand.target} className="ui-nav-brand">
                        {brand.logo && brand.logo}
                        <span className="ui-nav-brand-label">{brand.label}</span>
                    </a>
                )}
            
            <div className="ui-nav-item-container">
                {items && (
                    <ul className="ui-nav-item-list">
                        {items.map((item, index) => (
                            <MenuItem index={index} item={item} hostUrl={publicHostUrl} variant={variant}/>
                        ))}
                    </ul>
                )}
            </div>
            </div>
        </nav>
    );
};
