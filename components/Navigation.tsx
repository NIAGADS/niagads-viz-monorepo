'use client'
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/react";

export const Logo = () => {
    return <></>;
};

function NavigationMenu() {
    return (
        <Navbar isBordered={true} position="static">
            <NavbarBrand>
                <Logo />
                <p className="font-bold text-inherit">{process.env.NEXT_PUBLIC_PROJECT_NAME}</p>
            </NavbarBrand>
            <NavbarContent className="sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href={process.env.NEXT_PUBLIC_PROJECT_PUBLIC_URL}>
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link aria-current="page" href={`${process.env.NEXT_PUBLIC_PORTAL_URL}/collection`}>
                        Dataset Listing
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href={`${process.env.NEXT_PUBLIC_PORTAL_URL}/igvbrowser`}>
                        Genome Browser
                    </Link>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

export default NavigationMenu;
