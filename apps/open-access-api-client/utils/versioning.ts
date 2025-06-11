export const getCurrentVersion = () => {
    if (process.env.NEXT_PUBLIC_API_VERSION) {
        return process.env.NEXT_PUBLIC_API_VERSION;
    } else {
        throw Error("Please specify `NEXT_PUBLIC_API_VERSION` in the .env.local file.");
    }
};

export const getCurrentMajorVersion = () => {
    const version = getCurrentVersion();
    return version.split(".")[0];
};
