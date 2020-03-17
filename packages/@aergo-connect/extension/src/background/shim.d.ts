declare module 'dnode/browser.js' {
    type SendFunction = (data?: any) => void;
    type ApiFunction =
        ((send: SendFunction) => void | Promise<void>) |
        ((arg0: any, send: SendFunction) => void | Promise<void>) |
        ((arg0: any, arg1: any, send: SendFunction) => void | Promise<void>);

    function Dnode(api: Record<string, ApiFunction>): any;
    export default Dnode;
}

declare module 'pump';

declare module 'extensionizer';

declare module 'extension-port-stream';