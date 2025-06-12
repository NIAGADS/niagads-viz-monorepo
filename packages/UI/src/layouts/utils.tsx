import React from "react";
import { NavigationConfig } from "../Navigation";

// check if navigation content is a config (vs a child ReactNode)
export const isNavigationConfig = (obj: unknown): obj is NavigationConfig =>
    obj !== null && typeof obj === "object" && !React.isValidElement(obj);
