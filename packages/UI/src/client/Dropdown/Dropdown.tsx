import { Button, ButtonColorVariants } from "@/src/Button";
import React, { ReactNode, useState } from "react";

import styles from "./dropdown.module.css";

type DropdownVariants = "left" | "center" | "right";

interface DropdownProps {
    text: string;
    variant?: DropdownVariants;
    color?: ButtonColorVariants;
    icon?: React.ElementType;
    children: ReactNode;
};

export const Dropdown = ({
    text,
    variant = "left",
    color,
    icon,
    children,
}: DropdownProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`${styles["dropdown"]}`}>
            <Button color={color} onClick={() => setOpen(!open)} icon={icon}>
                {text}
            </Button>
            {open && (
                <div className={`${styles["dropdown-container"]} ${styles[variant]}`}>
                    {children}
                </div>
            )}
        </div>
    )
}
