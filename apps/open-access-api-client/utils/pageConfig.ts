export const getPageWrapperClass = () => {
    const bannerMsg = process.env.NEXT_PUBLIC_MESSAGE || undefined;
    return `page-wrapper ${bannerMsg ? "with-banner" : ""}`;
}