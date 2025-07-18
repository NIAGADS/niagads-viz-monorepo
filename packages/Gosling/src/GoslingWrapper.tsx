import React, { useEffect, useLayoutEffect, useRef } from "react";

import { GoslingComponent } from "gosling.js";

interface GoslingProps {
    id: string;
    specification: any;
    ref: any; // comes from the specialized component so can customize controls
}

export const GoslingWrapper: React.FC<GoslingProps> = ({ id, specification, ref }) => {
    useEffect(() => {
        /* need to add 
            <head>
                <link rel="stylesheet" href="https://unpkg.com/higlass@[1.12]/dist/hglib.css">
            </head>
        */
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/higlass@[1.12]/dist/hglib.css";
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link); // Cleanup on unmount
        };
    }, []);

    return (
        <GoslingComponent
            ref={ref}
            spec={specification}
            margin={0}
            padding={30}
            border={"none"}
            id={id}
            className={"gosling-component"}
            theme={"light"}
        />
    );
};

/*  layout effect?

*/
