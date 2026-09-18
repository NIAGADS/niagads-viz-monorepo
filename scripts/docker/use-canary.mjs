/**
 * Rewrites @niagads/* dependencies to use the npm `canary` tag during
 * non-production builds when that tag exists. Dependencies without a
 * published canary version retain their configured version range.
 */

import fs from "node:fs";
import { spawnSync } from "node:child_process";

if (process.env.BUILD_ENV === "production") {
    process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

for (const section of ["dependencies", "devDependencies"]) {
    for (const name of Object.keys(pkg[section] ?? {})) {
        if (name.startsWith("@niagads/")) {
            const result = spawnSync("npm", ["view", `${name}@canary`, "version"], {
                encoding: "utf8",
                stdio: ["ignore", "pipe", "ignore"],
            });

            if (result.status === 0 && result.stdout.trim()) {
                pkg[section][name] = "canary";
            }
        }
    }
}

fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
