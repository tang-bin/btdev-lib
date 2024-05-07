"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogData = void 0;
const Model_1 = __importDefault(require("./data/Model"));
const timeUtil_1 = __importDefault(require("./utils/timeUtil"));
class LogData {
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
        return `[${timeUtil_1.default.formatDate(this.time)}] ` + `(${this.type.toUpperCase()}): ` + this.msg;
    }
}
exports.LogData = LogData;
class Log extends Model_1.default {
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
exports.default = log;
