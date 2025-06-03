// required b/c `rapidoc` relies on the browser-specific global "self"
// which does not exist when next.js tries to pre-render
// solution: create a wrapper then dynamically import the wrapper

import "rapidoc";

// https://github.com/rapi-doc/RapiDoc/issues/293
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "rapi-doc": any;
        }
    }
}
/* eslint-enable @typescript-eslint/no-namespace */

interface RapiDocWrapperProps {
    specUrl: string;
}

export default function RapiDocWrapper({ specUrl }: RapiDocWrapperProps) {
    return <rapi-doc spec-url={specUrl} render-style="read" style={{ height: "100vh", width: "100%" }}></rapi-doc>;
}
