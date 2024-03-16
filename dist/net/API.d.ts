import Model from "../data/Model";
/**
 * This class is the super class of all API classes.
 */
export default class API extends Model {
    protected path: string;
    protected method: string;
    pathSec: {
        [name: string]: string;
    };
    params: {
        [name: string]: string;
    };
    payload: any;
    removeEmpty: boolean;
    constructor(path: string, method: string);
    setPath(name: string, val: any): API;
    setParams(params: {}): API;
    setParam(name: string, value: any): API;
    setPayload(payload: any): API;
    call(): Promise<any>;
    protected resultHook(rs: any): any;
    private _buildPath;
}
