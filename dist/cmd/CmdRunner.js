"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("../data/Model"));
const timeUtil_1 = __importDefault(require("../utils/timeUtil"));
const cmdUtil_node_1 = __importDefault(require("./cmdUtil.node"));
const confParser_node_1 = __importDefault(require("./confParser.node"));
const out_node_1 = __importDefault(require("./out.node"));
class CmdRunner extends Model_1.default {
    _data;
    constructor(data) {
        super();
        this._data = data?.$CLASS$ === "CmdData" ? data : new CmdData(data);
    }
    trace() {
        console.debug(this._data);
    }
    run(options) {
        options = options || {};
        options.fake = true;
        return this._data?.run(options) || Promise.reject("No commands to run");
    }
}
exports.default = CmdRunner;
class CmdData {
    title = "";
    cwd = "";
    cmdSetList = [];
    displayTotalTime = false;
    get $CLASS$() {
        return "CmdData";
    }
    constructor(data) {
        this.title = confParser_node_1.default.assemble(data?.title || "");
        this.cwd = confParser_node_1.default.assemble(data?.cwd || "");
        this.cmdSetList = (data?.cmdSetList || []).map((s) => new CmdSet(s, this.cwd));
        this.displayTotalTime = !!data?.displayTotalTime;
    }
    run(options) {
        const startTime = new Date().getTime();
        if (this.title) {
            out_node_1.default.header(this.title
                .split("\n")
                .map((l) => l.trim())
                .filter((l) => l.length > 0));
        }
        return this._runAllCmdSets(options).then((code) => {
            if (this.displayTotalTime) {
                const dur = timeUtil_1.default.formatDuring(new Date().getTime() - startTime);
                out_node_1.default.line(`Completed in [green]${dur}[/green]`, false, true);
            }
            return code;
        });
    }
    _runAllCmdSets(options) {
        let result = Promise.resolve(0);
        this.cmdSetList.forEach((cmdSet) => {
            result = result.then(() => cmdSet.run(options));
        });
        return result;
    }
}
class CmdSet {
    cmdList = [];
    cwd = "";
    title = "";
    constructor(data, cmdCwd) {
        this.cwd = confParser_node_1.default.assemble(data?.cwd) || cmdCwd || "";
        this.title = confParser_node_1.default.assemble(data?.title || "");
        const cmd = data?.cmd;
        if (cmd instanceof Array)
            this.cmdList = cmd;
        else if (typeof data?.cmd === "string")
            this.cmdList = [cmd];
        else
            this.cmdList = [];
        this.cmdList = this.cmdList.map((c) => confParser_node_1.default.assemble(c));
    }
    run(options) {
        const startTime = new Date().getTime();
        if (this.title) {
            out_node_1.default.line("   " + this.title, true, false);
            if (!options?.verbal)
                out_node_1.default.startSpinner(true);
        }
        if (options?.verbal) {
            out_node_1.default.line("[yellow][SPAWN]:[/yellow] " + this.cmdList.join("; "));
        }
        return cmdUtil_node_1.default.runCmdList(this.cmdList, this.cwd, options).then((code) => {
            if (code === 0) {
                // end without error.
                if (!options.verbal) {
                    const endTime = new Date().getTime(), durStr = timeUtil_1.default.formatDuring(endTime - startTime), duration = `[${durStr}]`;
                    out_node_1.default.stopSpinner();
                    out_node_1.default.prefix(out_node_1.default.successMark);
                    out_node_1.default.append(duration, true);
                }
            }
            else {
                // end with error.
                if (!options.verbal) {
                    out_node_1.default.stopSpinner();
                    out_node_1.default.prefix(out_node_1.default.failedMark, true);
                }
            }
            return code;
        });
    }
}
