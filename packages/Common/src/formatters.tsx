import React from "react";

/** Create a React Element using preformatted HTML */
export function safeHtml<P>(str: string, props?: P, Component?: React.ComponentClass<P>): JSX.Element;
export function safeHtml<P>(str: string, props?: P, Component?: React.FunctionComponent<P>): JSX.Element;
export function safeHtml<P>(str: string, props?: P, Component?: string): JSX.Element;
export function safeHtml<P>(str = "", props?: P, Component: any = "span"): JSX.Element {
    // Use innerHTML to auto close tags
    let container = document.createElement("div");
    container.innerHTML = str;
    return <Component {...props} dangerouslySetInnerHTML={{ __html: container.innerHTML }} />;
}
