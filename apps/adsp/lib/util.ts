export const num = (n: unknown) => (typeof n === "number" ? n.toLocaleString("en-US") : "—");

export const isTBD = (v: unknown) => v == null || v === "TBD";

export const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 16);
};

export const ext = (url?: string) =>
    isTBD(url) ? { href: undefined, disabled: true } : { href: url, disabled: false };
