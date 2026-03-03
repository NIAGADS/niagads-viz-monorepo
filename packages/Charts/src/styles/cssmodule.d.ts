// TypeScript declaration for CSS Modules
// This allows importing .module.css files without type errors
declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
}
