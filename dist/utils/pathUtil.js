"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
/**
 * Node.js only.
 */
class PathUtil {
    safePath(p) {
        p = String(p || "").trim();
        if (p === "" || p === "/")
            return "/tmp/safe-path";
        else
            return p;
    }
    regularPath(p, cwd = "") {
        p = String(p || "").trim();
        if (p.startsWith("~")) {
            p = path_1.default.join(os_1.default.homedir(), p.slice(1));
        }
        else if (cwd) {
            p = path_1.default.join(cwd, p);
        }
        return p;
    }
    displayPath(p) {
        const home = os_1.default.homedir();
        if (p.startsWith(home)) {
            p = p.replace(home, "~");
        }
        return p;
    }
}
const pathUtil = new PathUtil();
exports.default = pathUtil;
