import { AlertCircle, HelpCircle, Info } from "lucide-react";
import React, { ReactNode } from "react";

import { Tooltip } from "../Tooltip";
import { _get } from "@niagads/common";
import styles from "../styles/helpicon.module.css";

const ICONS = {
    alert: AlertCircle,
    question: HelpCircle,
    info: Info,
};

type HelpIconVariant = keyof typeof ICONS;

interface HelpIconProps {
    anchorId: string;
    message: ReactNode | string;
    variant: HelpIconVariant;
}

export const HelpIcon = ({ anchorId, message, variant }: HelpIconProps) => {
    const MsgIcon = ICONS[variant] || Info; // fallback to Info

    return (
        <Tooltip anchorId={`help-${anchorId}`} content={message}>
            <MsgIcon className={styles["ui-help-inline-info-bubble"]} />
        </Tooltip>
    );
};

export const renderHelpIcon = (anchorId: string, message: ReactNode | string, variant: HelpIconVariant) => {
    return <HelpIcon anchorId={anchorId} message={message} variant={variant} />;
};

/**
 * maps string key to icon components
 * @param key
 * @returns
 */
export const getIconElement = (key: string) => {
    const icon = ICONS[key as keyof typeof ICONS] || Info;
    return icon;
};

export const renderWithHelpIcon = (
    textElement: ReactNode | string,
    variant: HelpIconVariant,
    message: string,
    anchorId: string
) => {
    return (
        <div className={styles["ui-help-inline-flex"]}>
            {textElement}
            {renderHelpIcon(anchorId, message, variant)}
        </div>
    );
};
