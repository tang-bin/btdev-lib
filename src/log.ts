import EventDispatcher from "./data/Model.js";
import timeUtil from "./utils/timeUtil.js";

export class LogData {
    public time: number = 0;
    public type: string = "";
    public msg: string = "";

    constructor(type: string, msg: string, toConsole?: boolean) {
        this.time = new Date().getTime();
        this.type = type;
        this.msg = msg;

        if (toConsole) console.debug(this.toString());
    }

    public toString(): string {
        return `[${timeUtil.formatDate(this.time)}] ` + `(${this.type.toUpperCase()}): ` + this.msg;
    }
}

class Log extends EventDispatcher {
    public logs: LogData[] = [];
    public toConsole: boolean = false;

    constructor() {
        super();
    }

    public msg(msg: string): void {
        this.logs.push(new LogData("msg", msg, this.toConsole));
    }

    public error(msg: string): void {
        this.logs.push(new LogData("error", msg, this.toConsole));
    }
}

const log = new Log();
export default log;
