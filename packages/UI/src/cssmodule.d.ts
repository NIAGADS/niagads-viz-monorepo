// TypeScript declaration for CSS Modules
// This allows importing .module.css files without type errors
declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
}

// allows importing of bare css files (e.g., global.css)
declare module "*.css" {
    const content: string;
    export default content;
}
