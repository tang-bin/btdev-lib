import fs from "fs";
import path from "path";
import pathUtil from "../utils/pathUtil.node";
import dataUtil from "../utils/dataUtil";
import log from "../log";

class ConfParser {
    private _config: { [name: string]: any } = {};
    public defaultConfig: { [name: string]: any } = {};

    constructor() {}

    public get(refPath: string, guessType: boolean = true): any {
        let conf: any = dataUtil.readByPath(this._config, refPath);

        if ((conf === null || conf === undefined) && this.defaultConfig) {
            conf = dataUtil.readByPath(this.defaultConfig, refPath);
        }

        if (guessType) return dataUtil.guessType(conf);
        else return conf;
    }

    /**
     *
     * @param filePath
     * @param cwd
     * @param override If true, override the all loaded configurations by this process.
     * @returns
     */
    public load(filePath: string | string[], cwd?: string, override?: boolean): ConfParser {
        if (typeof filePath === "string") filePath = [filePath];

        filePath.forEach((p) => {
            p = pathUtil.regularPath(p);

            if (cwd) p = path.join(cwd, p);

            if (fs.existsSync(p)) {
                log.msg("customized config file exists");
                try {
                    const config = JSON.parse(fs.readFileSync(p).toString());
                    if (override) this._config = config;
                    else this._config = dataUtil.combine(this._config, config);
                } catch (e) {
                    log.error("customized config file parse failed, ignore.");
                    this._config = {};
                }
            }
        });

        log.msg("Config updated: " + this.toString());
        return this;
    }

    public updateConf(name: string, target: Function | any): ConfParser {
        name = String(name).trim();
        if (name) {
            if (typeof target === "function") {
                this._config[name] = target.call(this, this.get(name));
            } else if (typeof target === "string") {
                const matches = target.match(/\$\{(.*?)\}/gi) || [];
                matches.forEach((m: string) => {
                    const refPath = m.slice(2, -1);
                    if (!refPath) target = target.replaceAll(m, this.get(name));
                    else target = target.replaceAll(m, this.get(refPath) || m);
                });
                this._config[name] = target;
            } else {
                this._config[name] = target;
            }
        }
        return this;
    }

    public toString(): string {
        return (
            "{\n" +
            Object.keys(this._config)
                .map((key) => `\t${key}: ${this._config[key]}`)
                .join("\n") +
            "\n}"
        );
    }
}

const confParser = new ConfParser();
export default confParser;
