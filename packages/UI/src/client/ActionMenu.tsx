import { Button, ButtonColorVariants } from "../Button";
import React, { ReactNode, useEffect, useId, useRef, useState } from "react";

import { InlineIcon } from "../InlineIcon";
import { StylingProps } from "../types";
import styles from "../styles/actionmenu.module.css";

interface ActionMenuProps extends StylingProps {
    label: string;
    icon: React.ElementType;
    children: ReactNode;
    buttonColor?: ButtonColorVariants;
}

export const ActionMenu = ({
    label,
    icon,
    children,
    className = "",
    buttonColor = "default",
    style = {},
    ...rest
}: ActionMenuProps & React.HTMLAttributes<HTMLDivElement>) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const buttonId = useId();
    const Icon = icon;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`${styles.actionMenu} ${className}`} style={style} ref={ref} {...rest}>
            <Button
                id={buttonId}
                color={buttonColor}
                className={styles.toggle}
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
            >
                {icon ? <InlineIcon icon={<Icon size={18} />}>{label}</InlineIcon> : label}
            </Button>
            {open && (
                <div className={styles.menu} style={{ display: open ? "block" : "none" }}>
                    {children}
                </div>
            )}
        </div>
    );
};
