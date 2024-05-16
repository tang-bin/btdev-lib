import { spawn } from "child_process";
import out from "./out.node";
import timeUtil from "../utils/timeUtil";

/**
 * Node.js only.
 */
export class CmdSet {
    public fullCmd: string = "";
    public cwd: string = "";
    public title: string = "";
    public listeners: { [name: string]: Function | undefined } = {
        onStdout: undefined,
        onStderr: undefined,
        onError: undefined,
    };
}

class Cmd {
    public verbal: boolean = false;
    public printStderr: boolean = false;

    public exec(
        fullCmd: string | string[],
        cwd?: string,
        title?: string,
        callbacks?: { [name: string]: Function | undefined }
    ): Promise<any> {
        const startTime = new Date().getTime();

        callbacks = callbacks || {};

        const originalOnClose = callbacks.onClose || undefined;
        callbacks.onClose = (code: number) => {
            if (this.verbal) out.line("[SPAWN Close]: " + code);

            if (code === 0) {
                // end without error.
                if (!this.verbal) {
                    const endTime = new Date().getTime(),
                        durStr = timeUtil.formatDuring(endTime - startTime),
                        duration = `[${durStr}]`;
                    out.stopSpinner();
                    out.prefix(out.successMark);
                    out.append(duration, true);
                }
            } else {
                // end with error.
                if (!this.verbal) {
                    out.stopSpinner();
                    out.prefix(out.failedMark, true);
                }
            }

            originalOnClose?.call(null, code);
        };

        if (title) {
            out.line("   " + title, true, false);
            if (!this.verbal) out.startSpinner(true);
        }

        if (this.verbal) {
            out.line("[yellow][SPAWN]:[/yellow] " + fullCmd);
        }

        if (typeof fullCmd === "string") fullCmd = [fullCmd];
        return this.serialSpawn(fullCmd, cwd, callbacks);
    }

    public parseCmd(fullCmd: string): [string, string[]] {
        const input = fullCmd
                .split(" ")
                .map((s) => String(s || "").trim())
                .filter((s) => s),
            cmd = input[0],
            args = input.slice(1);
        return [cmd, args];
    }

    public serial(cmds: any[]): Promise<any> {
        let result = Promise.resolve();
        cmds.forEach((d: any[]) => {
            result = result.then(() => this.exec(d[0], d[1], d[2], d[3]));
        });
        return result;
    }

    public serialSpawn(
        cmds: string[],
        cwd?: string,
        callbacks?: { [name: string]: Function | undefined }
    ): Promise<any> {
        let result = Promise.resolve();
        cmds.forEach((cmd: string) => {
            result = result.then(() => this.runCmd(cmd, cwd, callbacks));
        });
        return result;
    }

    public runCmd(fullCmd: string, cwd?: string, callbacks?: { [name: string]: Function | undefined }): Promise<any> {
        const [cmd, argv] = this.parseCmd(fullCmd);
        return new Promise((resolve, reject) => {
            const proc = spawn(cmd, argv, cwd ? { cwd } : undefined);
            proc.stdout.on("data", (data) => {
                if (this.verbal) out.line(data, false, false);
                callbacks?.onStdout?.call(null, data.toString());
            });
            proc.stderr.on("data", (data) => {
                if (this.printStderr) out.line("[red]stderr:[/red] " + data, false, false);
                callbacks?.onStderr?.call(null, data.toString());
            });
            proc.on("error", (err) => callbacks?.onError?.call(null, err));
            proc.on("close", (code) => {
                callbacks?.onClose?.call(null, code);
                if (code === 0) resolve(code);
                else reject(code);
            });
        });
    }
}

const cmd = new Cmd();
export default cmd;
