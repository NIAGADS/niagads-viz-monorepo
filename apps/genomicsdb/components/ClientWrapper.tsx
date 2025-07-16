"use client";

import React from "react";

interface ClientComponentWrapperProps {
    children: React.ReactNode;
}

const ClientComponentWrapper = ({ children }: ClientComponentWrapperProps) => {
    return <>{children}</>;
};

export default ClientComponentWrapper;
