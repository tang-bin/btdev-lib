/**
 * Node.js only.
 */
export declare class CmdSet {
    fullCmd: string;
    cwd: string;
    title: string;
    listeners: {
        [name: string]: Function | undefined;
    };
}
declare class Cmd {
    verbal: boolean;
    printStderr: boolean;
    exec(cmdList: string | string[], cwd?: string, title?: string, callbacks?: {
        [name: string]: Function | undefined;
    }): Promise<any>;
    parseCmd(fullCmd: string): [string, string[]];
    serial(cmds: any[]): Promise<any>;
    runCmdList(cmdList: string[], cwd?: string, options?: {
        [name: string]: any;
    }): Promise<any>;
    runCmd(fullCmd: string, cwd?: string, options?: {
        [name: string]: any;
    }): Promise<any>;
}
declare const cmd: Cmd;
export default cmd;
