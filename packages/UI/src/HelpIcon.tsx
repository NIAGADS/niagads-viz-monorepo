import React, { ReactNode } from "react";

import { InformationCircleIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

import { Tooltip } from "./Tooltip";

interface HelpIcon {
    message: ReactNode | string;
    type: "question" | "info";
}

export const HelpIcon = ({ message, type }: HelpIcon) => {
    const icon =
        type === "info" ? (
            <InformationCircleIcon className="ml-1 size-4 text-blue-600" />
        ) : (
            <QuestionMarkCircleIcon className="ml-1 size-4 text-blue-600" />
        );

    return <Tooltip message={message}>{icon}</Tooltip>;
};

export const renderHelpIcon = (message: ReactNode | string, type: "question" | "info" = "question") => {
    return <HelpIcon message={message} type={type} />;
};
