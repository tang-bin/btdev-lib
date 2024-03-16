import EventDispatcher from "./data/Model.js";
export declare class LogData {
    time: number;
    type: string;
    msg: string;
    constructor(type: string, msg: string, toConsole?: boolean);
    toString(): string;
}
declare class Log extends EventDispatcher {
    logs: LogData[];
    toConsole: boolean;
    constructor();
    msg(msg: string): void;
    error(msg: string): void;
}
declare const log: Log;
export default log;
