"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("../data/Model"));
const dataUtil_1 = __importDefault(require("../utils/dataUtil"));
const xhr_1 = __importDefault(require("./xhr"));
/**
 * This class is the super class of all API classes.
 */
class API extends Model_1.default {
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
            dataUtil_1.default.removeEmpty(this.params);
            dataUtil_1.default.removeEmpty(this.payload);
        }
        if (!p) {
            return Promise.reject("No API PATH");
        }
        else if (this.method === "GET") {
            return xhr_1.default.get(p, this.params).then((rs) => this.resultHook(rs));
        }
        else if (this.method === "POST") {
            return xhr_1.default.post(p, this.params, this.payload).then((rs) => this.resultHook(rs));
        }
        else if (this.method === "DELETE" || this.method === "DEL") {
            return xhr_1.default.delete(p, this.params).then((rs) => this.resultHook(rs));
        }
        else if (this.method === "PUT") {
            return xhr_1.default.put(p, this.params, this.payload).then((rs) => this.resultHook(rs));
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
exports.default = API;
