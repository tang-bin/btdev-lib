import Model from "../data/Model";
import dataUtil from "../utils/dataUtil";
import xhr from "./xhr";
/**
 * This class is the super class of all API classes.
 */
export default class API extends Model {
    path = "";
    method = "";
    pathSec = {};
    params = {};
    payload = undefined;
    // if true, remove null and undefined values from params and payload.
    removeEmpty = false;
    constructor(path, method) {
        super();
        this.path = path;
        this.method = String(method).toUpperCase();
    }
    setPath(name, val) {
        this.pathSec[name] = val;
        return this;
    }
    setParams(params) {
        this.params = params || {};
        return this;
    }
    setParam(name, value) {
        name = String(name || "").trim();
        if (typeof value === "object")
            value = JSON.stringify(value);
        else
            value = String(value || "").trim();
        if (name) {
            this.params = this.params || {};
            this.params[name] = value;
        }
        return this;
    }
    setPayload(payload) {
        this.payload = payload;
        return this;
    }
    call() {
        const p = this._buildPath();
        if (this.removeEmpty) {
            dataUtil.removeEmpty(this.params);
            dataUtil.removeEmpty(this.payload);
        }
        if (!p) {
            return Promise.reject("No API PATH");
        }
        else if (this.method === "GET") {
            return xhr.get(p, this.params).then((rs) => this.resultHook(rs));
        }
        else if (this.method === "POST") {
            return xhr.post(p, this.params, this.payload).then((rs) => this.resultHook(rs));
        }
        else if (this.method === "DELETE" || this.method === "DEL") {
            return xhr.delete(p, this.params).then((rs) => this.resultHook(rs));
        }
        else if (this.method === "PUT") {
            return xhr.put(p, this.params, this.payload).then((rs) => this.resultHook(rs));
        }
        else {
            return Promise.reject("Invalid API Method");
        }
    }
    resultHook(rs) {
        console.debug("run hook in super class");
        // This function should be overrode by the child classes
        // to handle the result data before returning to the caller.
        return rs;
    }
    _buildPath() {
        let p = String(this.path || "").trim();
        (p.match(/<.*?>/g) || []).forEach((m) => {
            const paramName = m.substring(1, m.length - 1);
            if (paramName in this) {
                p = p.replace(m, String(this.pathSec[paramName]));
            }
        });
        p = p.replace(/\/\//gi, "/");
        return p;
    }
}
