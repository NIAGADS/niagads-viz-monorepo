import { ExclamationCircleIcon, InformationCircleIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import React, { ReactNode } from "react";

import { Tooltip } from "../Tooltip";
import { _get } from "@niagads/common";

interface HelpIconProps {
    anchorId: string;
    message: ReactNode | string;
    type: "question" | "info";
}

export const HelpIcon = ({ anchorId, message, type }: HelpIconProps) => {
    const icon =
        type === "info" ? (
            <InformationCircleIcon className="inline-info-bubble" />
        ) : (
            <QuestionMarkCircleIcon className="inline-info-bubble" />
        );

    return (
        <Tooltip anchorId={`help-${anchorId}`} content={message}>
            {icon}
        </Tooltip>
    );
};

export const renderHelpIcon = (
    anchorId: string,
    message: ReactNode | string,
    type: "question" | "info" = "question"
) => {
    return <HelpIcon anchorId={anchorId} message={message} type={type} />;
};

const ICONS = {
    info: ExclamationCircleIcon,
    question: QuestionMarkCircleIcon,
    infoOutline: InformationCircleIcon,
};

/**
 * maps string key to icon components
 * @param key
 * @returns
 */
export const getIconElement = (key: string) => {
    const icon = _get(key, ICONS);
    if (icon === null) {
        throw Error("Error rendering field: invalid icon `" + key + "`");
    }
    return icon;
};

export const renderWithHelpIcon = (
    textElement: ReactNode | string,
    type: "question" | "info",
    message: string,
    anchorId: string
) => {
    return (
        <div className="inline-flex">
            {textElement}
            {renderHelpIcon(anchorId, message, type)}
        </div>
    );
};
