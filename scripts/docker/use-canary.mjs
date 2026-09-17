import fs from "node:fs";

if (process.env.NODE_ENV === "production") {
    process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

for (const section of ["dependencies", "devDependencies"]) {
    for (const name of Object.keys(pkg[section] ?? {})) {
        if (name.startsWith("@niagads/")) {
            pkg[section][name] = "canary";
        }
    }
}

fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));