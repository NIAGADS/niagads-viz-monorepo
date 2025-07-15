// app/record/not-found.tsx

import { Alert } from "@niagads/ui";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="nextjs-default-404-styles">
            <Alert variant="info" message={"Record not found"}>
                <div>
                    <Link href="/">Return to Home</Link>
                </div>
            </Alert>
        </div>
    );
}
