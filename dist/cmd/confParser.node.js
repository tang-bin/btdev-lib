"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pathUtil_node_1 = __importDefault(require("../utils/pathUtil.node"));
const dataUtil_1 = __importDefault(require("../utils/dataUtil"));
const log_1 = __importDefault(require("../log"));
class ConfParser {
    _config = {};
    defaultConfig = {};
    constructor() { }
    get(refPath, guessType = true) {
        let conf = dataUtil_1.default.readByPath(this._config, refPath);
        if ((conf === null || conf === undefined) && this.defaultConfig) {
            conf = dataUtil_1.default.readByPath(this.defaultConfig, refPath);
        }
        if (guessType)
            return dataUtil_1.default.guessType(conf);
        else
            return conf;
    }
    /**
     *
     * @param filePath
     * @param cwd
     * @param override If true, override the all loaded configurations by this process.
     * @returns
     */
    load(filePath, cwd, override) {
        if (typeof filePath === "string")
            filePath = [filePath];
        filePath.forEach((p) => {
            p = pathUtil_node_1.default.regularPath(p);
            if (cwd)
                p = path_1.default.join(cwd, p);
            if (fs_1.default.existsSync(p)) {
                log_1.default.msg("customized config file exists");
                try {
                    const config = JSON.parse(fs_1.default.readFileSync(p).toString());
                    if (override)
                        this._config = config;
                    else
                        this._config = dataUtil_1.default.combine(this._config, config);
                }
                catch (e) {
                    log_1.default.error("customized config file parse failed, ignore.");
                    this._config = {};
                }
            }
        });
        log_1.default.msg("Config updated: " + this.toString());
        return this;
    }
    updateConf(name, target) {
        name = String(name).trim();
        if (name) {
            if (typeof target === "function") {
                this._config[name] = target.call(this, this.get(name));
            }
            else if (typeof target === "string") {
                const matches = target.match(/\$\{(.*?)\}/gi) || [];
                matches.forEach((m) => {
                    const refPath = m.slice(2, -1);
                    if (!refPath)
                        target = target.replaceAll(m, this.get(name));
                    else
                        target = target.replaceAll(m, this.get(refPath) || m);
                });
                this._config[name] = target;
            }
            else {
                this._config[name] = target;
            }
        }
        return this;
    }
    toString() {
        return ("{\n" +
            Object.keys(this._config)
                .map((key) => `\t${key}: ${this._config[key]}`)
                .join("\n") +
            "\n}");
    }
}
const confParser = new ConfParser();
exports.default = confParser;
