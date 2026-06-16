import React, { ReactNode, useEffect, useId, useRef, useState } from "react";

import { Button, ButtonColorVariants } from "@/src/Button";
import { InlineIcon } from "@/src/InlineIcon";
import { StylingProps } from "@/src/types";

import styles from "./action-menu.module.css";
import { useClickAway } from "@/src/hooks/useClickAway";

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

    useClickAway(ref, () => setOpen(false));

    return (
        <div className={`${styles.actionMenu} ${className}`} style={style} ref={ref} {...rest}>
            <Button
                id={buttonId}
                color={buttonColor}
                // className={styles.toggle} removing this style to keep all buttons consistent -- can add back if this was intentional
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
