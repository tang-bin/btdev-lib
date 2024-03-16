import Model from "../data/Model";
declare class XHR extends Model {
    token: string;
    API_HOST: string;
    API_BASE: string;
    headers: any;
    constructor();
    get(api: string, argv?: any): Promise<any>;
    post(api: string, argv?: any, data?: any): Promise<any>;
    delete(api: string, argv?: any): Promise<any>;
    put(api: string, argv?: any, data?: any): Promise<any>;
    upload(api: string, file: File, argv?: any, onProgress?: Function): Promise<any>;
    request(url: string, method: string, headers?: any, data?: any, handlers?: {
        [name: string]: Function;
    }): Promise<any>;
    private _buildURL;
}
declare const xhr: XHR;
export default xhr;
