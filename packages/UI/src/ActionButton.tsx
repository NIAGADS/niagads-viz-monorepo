
import React, { ReactNode } from "react";
import { _get } from "@niagads/common";
import "./styles/action-button.css"

type ButtonVariants = "primary";
interface ActionButtonProps {
    variant?: ButtonVariants;
    children: ReactNode | string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | null;
}

export const ActionButton = ({ variant, children, onClick, disabled = false }: ActionButtonProps) => {
    return (
        <button disabled={disabled} className={`action-button ${variant ? variant : ""}`} onClick={onClick}>
            {children}
        </button>
    );
};