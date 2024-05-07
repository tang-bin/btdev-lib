"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const numUtil_1 = __importDefault(require("./numUtil"));
class DataUtil {
    isEmpty(val) {
        return val === null || val === undefined || String(val).trim() === "";
    }
    sortBy(list, path, // "a.b.c" dot connected path.
    clone, desc) {
        let newList = clone ? this.clone(list) : list;
        newList.sort((a, b) => {
            a = this._findCompareValue(a, path);
            b = this._findCompareValue(b, path);
            if (a > b)
                return desc ? -1 : 1;
            else if (a < b)
                return desc ? 1 : -1;
            else
                return 0;
        });
        return newList;
    }
    _findCompareValue(data, path) {
        data = this.readByPath(data, path);
        return this.toNum(data) || String(data).trim().toLowerCase().replace(/\s/gi, "");
    }
    toNum(val) {
        let n = Number(val);
        if (isNaN(n)) {
            const s = String(val).trim();
            if (s.endsWith("%")) {
                n = Number(s.substring(0, s.length - 1));
                return isNaN(n) ? undefined : n;
            }
        }
        else
            return n;
    }
    static cleanObject(obj, cleanEmptyString) {
        if (obj instanceof Object) {
            for (let key in obj) {
                const val = obj[key];
                if (val === null || val === undefined || (val === "" && cleanEmptyString))
                    delete obj[key];
            }
        }
        return obj;
    }
    clone(data) {
        if (data instanceof Array) {
            return data.map((d) => this.clone(d));
        }
        else if (data instanceof Object) {
            const newData = {};
            for (const key in data) {
                newData[key] = this.clone(data[key]);
            }
            return newData;
        }
        else {
            return data;
        }
    }
    readByPath(data, path) {
        const pathList = (path || "")
            .split(".")
            .map((p) => p.trim())
            .filter((p) => p);
        if (!pathList.length)
            return data;
        pathList.forEach((p) => {
            if (data && data instanceof Object)
                data = data[p];
        });
        return data;
    }
    parseKeyValue(str) {
        str = String(str || "").trim();
        const i = str.indexOf(":");
        if (i === -1)
            return { key: str, value: "" };
        else {
            return {
                key: str.substring(0, i).trim(),
                value: str.substring(i + 1).trim(),
            };
        }
    }
    guessType(val) {
        // use original value
        if (val === null || val === undefined || val === true || val === false)
            return val;
        if (String(val).trim() === "")
            return val;
        // number
        const n = Number(val);
        if (!isNaN(n))
            return n;
        // boolean
        const s = String(val).trim().toLowerCase();
        if (s === "true")
            return true;
        else if (s === "false")
            return false;
        // TODO: JSON
        return val;
    }
    /**
     * Combine two or more objects into one object.
     * If the attributes have the same key, the latter ones will overwrite the former one.
     *
     * This will NOT clone the data. Do clone before passing to this method if needed.
     *
     * @param obj A list of objects need to be combined.
     * @returns
     */
    combine(...obj) {
        const newObj = {};
        obj.forEach((d) => {
            for (let key in d) {
                newObj[key] = d[key];
            }
        });
        return newObj;
    }
    randPick(list) {
        return list[numUtil_1.default.randInt(list.length - 1)];
    }
    randArray(arr) {
        return this.messOrder(arr.length).map((i) => arr[i]);
    }
    messOrder(len) {
        const arr = [...Array(len)].map((v, i) => i);
        const newArr = [];
        for (let i = 0; i < len; i++) {
            const index = numUtil_1.default.randInt(arr.length - 1);
            newArr.push(arr[index]);
            arr.splice(index, 1);
        }
        return newArr;
    }
    removeEmpty(data, removeNull = true, removeUndefined = true, removeBlank = false, removeZero = false) {
        if (!(data instanceof Object))
            return data;
        Object.keys(data).forEach((key) => {
            const val = data[key];
            if ((removeNull && val === null) ||
                (removeUndefined && val === undefined) ||
                (removeBlank && val === "") ||
                (removeZero && val === 0)) {
                delete data[key];
            }
        });
    }
}
const dataUtil = new DataUtil();
exports.default = dataUtil;
