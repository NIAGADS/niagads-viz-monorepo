import React from "react";

type Variants = "default" | "primary" | "secondary" | "light" | "accent";

export interface MenuItem {
    label: string;
    href: string;
}

interface NavigationProps {
    logo?: string;
    brand: MenuItem;
    menuItems: MenuItem[];
    variant?: Variants;
}

const __TAILWIND_CSS = {
    default: "bg-grey-50",
    primary: "bg-primary",
    secondary: "bg-secondary",
    light: "bg-white",
    accent: "bg-accent",

    primaryLink: "text-secondary",
};

const __renderMenuItems = (items: MenuItem[]) => {
    return items.map((items, index) => {
        return (
            <a
                key={index}
                href={items.href}
                className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-white mr-4"
            >
                {items.label}
            </a>
        );
    });
};

export const NavigationBar = ({ variant = "primary", brand, logo, menuItems }: NavigationProps) => {
    return (
        //<nav className="w-full sticky top-0 shadow-lg z-10">
        <nav className="w-full shadow-xl z-10">
            <div className={`flex items-center justify-between flex-wrap pt-6 pb-6 ${__TAILWIND_CSS[variant]}`}>
                <div className="flex items-center flex-shrink-0 text-white mr-10">
                    <svg className="fill-current h-8 w-8 mr-2"></svg> {/* TODO: logo */}
                    <a className="text-white text-4xl hover:no-underline" href={brand.href} target="_blank">
                        {brand.label}
                    </a>
                </div>

                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-lg lg:flex-grow">{__renderMenuItems(menuItems)}</div>
                </div>
            </div>
        </nav>
    );
};
