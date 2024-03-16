import numUtil from "./numUtil.js";

class DataUtil {
    public isEmpty(val: any): boolean {
        return val === null || val === undefined || String(val).trim() === "";
    }

    public sortBy(
        list: Array<any>,
        path: string, // "a.b.c" dot connected path.
        clone?: boolean,
        desc?: boolean
    ): Array<any> {
        let newList = clone ? this.clone(list) : list;
        newList.sort((a: any, b: any) => {
            a = this._findCompareValue(a, path);
            b = this._findCompareValue(b, path);
            if (a > b) return desc ? -1 : 1;
            else if (a < b) return desc ? 1 : -1;
            else return 0;
        });
        return newList;
    }

    private _findCompareValue(data: any, path: string): any {
        data = this.readByPath(data, path);
        return this.toNum(data) || String(data).trim().toLowerCase().replace(/\s/gi, "");
    }

    public toNum(val: any): number | undefined {
        let n = Number(val);
        if (isNaN(n)) {
            const s = String(val).trim();
            if (s.endsWith("%")) {
                n = Number(s.substring(0, s.length - 1));
                return isNaN(n) ? undefined : n;
            }
        } else return n;
    }

    static cleanObject(obj: any, cleanEmptyString?: boolean) {
        if (obj instanceof Object) {
            for (let key in obj) {
                const val = obj[key];
                if (val === null || val === undefined || (val === "" && cleanEmptyString)) delete obj[key];
            }
        }
        return obj;
    }

    public clone(data: any): any {
        if (data instanceof Array) {
            return data.map((d) => this.clone(d));
        } else if (data instanceof Object) {
            const newData: any = {};
            for (const key in data) {
                newData[key] = this.clone(data[key]);
            }
            return newData;
        } else {
            return data;
        }
    }

    public readByPath(data: any, path: string): any {
        const pathList = (path || "")
            .split(".")
            .map((p) => p.trim())
            .filter((p) => p);
        if (!pathList.length) return data;
        pathList.forEach((p) => {
            if (data && data instanceof Object) data = data[p];
        });
        return data;
    }

    public parseKeyValue(str: string): { key: string; value: string } {
        str = String(str || "").trim();
        const i: number = str.indexOf(":");

        if (i === -1) return { key: str, value: "" };
        else {
            return {
                key: str.substring(0, i).trim(),
                value: str.substring(i + 1).trim(),
            };
        }
    }

    public guessType(val: any): any {
        // use original value
        if (val === null || val === undefined || val === true || val === false) return val;
        if (String(val).trim() === "") return val;

        // number
        const n = Number(val);
        if (!isNaN(n)) return n;

        // boolean
        const s = String(val).trim().toLowerCase();
        if (s === "true") return true;
        else if (s === "false") return false;

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
    public combine(...obj: { [key: string]: any }[]): {
        [key: string]: any;
    } {
        const newObj: { [key: string]: any } = {};
        obj.forEach((d: { [key: string]: any }) => {
            for (let key in d) {
                newObj[key] = d[key];
            }
        });
        return newObj;
    }

    public randPick(list: any[]): any {
        return list[numUtil.randInt(list.length - 1)];
    }

    public randArray(arr: any[]): any[] {
        return this.messOrder(arr.length).map((i) => arr[i]);
    }

    public messOrder(len: number): number[] {
        const arr = [...Array(len)].map((v, i) => i);
        const newArr = [];
        for (let i = 0; i < len; i++) {
            const index = numUtil.randInt(arr.length - 1);
            newArr.push(arr[index]);
            arr.splice(index, 1);
        }
        return newArr;
    }

    public removeEmpty(
        data: any,
        removeNull: boolean = true,
        removeUndefined: boolean = true,
        removeBlank: boolean = false,
        removeZero: boolean = false
    ): any {
        if (!(data instanceof Object)) return data;

        Object.keys(data).forEach((key) => {
            const val = data[key];
            if (
                (removeNull && val === null) ||
                (removeUndefined && val === undefined) ||
                (removeBlank && val === "") ||
                (removeZero && val === 0)
            ) {
                delete data[key];
            }
        });
    }
}

const dataUtil = new DataUtil();
export default dataUtil;
