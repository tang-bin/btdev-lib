import EventDispatcher from "./data/Model.js";
import timeUtil from "./utils/timeUtil.js";
export class LogData {
    time = 0;
    type = "";
    msg = "";
    constructor(type, msg, toConsole) {
        this.time = new Date().getTime();
        this.type = type;
        this.msg = msg;
        if (toConsole)
            console.debug(this.toString());
    }
    toString() {
        return `[${timeUtil.formatDate(this.time)}] ` + `(${this.type.toUpperCase()}): ` + this.msg;
    }
}
class Log extends EventDispatcher {
    logs = [];
    toConsole = false;
    constructor() {
        super();
    }
    msg(msg) {
        this.logs.push(new LogData("msg", msg, this.toConsole));
    }
    error(msg) {
        this.logs.push(new LogData("error", msg, this.toConsole));
    }
}
const log = new Log();
export default log;
