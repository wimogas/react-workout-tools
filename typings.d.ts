declare module "*.module.css";

declare module '*.svg?raw' {
    const content: any;
    export default content;
}

declare module '*.svg' {
    const content: any;
    export default content;
}

declare module '*.json';