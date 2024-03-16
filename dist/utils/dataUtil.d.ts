declare class DataUtil {
    isEmpty(val: any): boolean;
    sortBy(list: Array<any>, path: string, // "a.b.c" dot connected path.
    clone?: boolean, desc?: boolean): Array<any>;
    private _findCompareValue;
    toNum(val: any): number | undefined;
    static cleanObject(obj: any, cleanEmptyString?: boolean): any;
    clone(data: any): any;
    readByPath(data: any, path: string): any;
    parseKeyValue(str: string): {
        key: string;
        value: string;
    };
    guessType(val: any): any;
    /**
     * Combine two or more objects into one object.
     * If the attributes have the same key, the latter ones will overwrite the former one.
     *
     * This will NOT clone the data. Do clone before passing to this method if needed.
     *
     * @param obj A list of objects need to be combined.
     * @returns
     */
    combine(...obj: {
        [key: string]: any;
    }[]): {
        [key: string]: any;
    };
    randPick(list: any[]): any;
    randArray(arr: any[]): any[];
    messOrder(len: number): number[];
    removeEmpty(data: any, removeNull?: boolean, removeUndefined?: boolean, removeBlank?: boolean, removeZero?: boolean): any;
}
declare const dataUtil: DataUtil;
export default dataUtil;
