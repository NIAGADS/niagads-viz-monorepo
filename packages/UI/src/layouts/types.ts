import { ReactNode } from "react";

import { NavigationConfig } from "../Navigation";

export interface LayoutProps {
    children: ReactNode;
}

export interface RootLayoutProps extends LayoutProps {
    navConfig: NavigationConfig;
    fullWidth?: boolean;
}
