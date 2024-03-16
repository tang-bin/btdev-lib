import Model from "../data/Model";

class XHR extends Model {
    public token: string = "";
    public API_HOST: string = "";
    public API_BASE: string = "/phoenix/rest/h5";
    public headers: any = {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS",
    };
    constructor() {
        super();
    }
    public get(api: string, argv?: any): Promise<any> {
        return this.request("GET", this._buildURL(api, argv));
    }

    public post(api: string, argv?: any, data?: any): Promise<any> {
        return this.request("POST", this._buildURL(api, argv), null, data);
    }

    public delete(api: string, argv?: any): Promise<any> {
        return this.request("DELETE", this._buildURL(api, argv));
    }

    public put(api: string, argv?: any, data?: any): Promise<any> {
        return this.request("PUT", this._buildURL(api, argv), null, data);
    }

    public upload(api: string, file: File, argv?: any, onProgress?: Function): Promise<any> {
        const url = this._buildURL(api, argv);
        const fd = new FormData();
        fd.append("file", file);

        return this.request("post", url, { "Content-Type": undefined }, fd, {
            progress: ($event: any) => onProgress?.call(null, $event),
        });
    }

    public request(
        url: string,
        method: string,
        headers?: any,
        data?: any,
        handlers?: { [name: string]: Function }
    ): Promise<any> {
        // method
        method = String(method).toUpperCase();
        if (!["GET", "POST", "PUT", "DELETE"].includes(method)) {
            throw new Error("[UI] Unknown query method:" + method);
        }

        // headers
        headers = headers || this.headers;

        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            req.addEventListener("progress", (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
                handlers?.progress?.call(null, e);
            });
            req.addEventListener("load", (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
                handlers?.load?.call(null, e);
                if (req.status !== 200) {
                    reject(`XHR Error ${req.status}: ${req.statusText}`);
                } else {
                    resolve(req.response);
                }
            });
            req.addEventListener("error", (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
                handlers?.error?.call(null, e);
                reject(`XHR Error ${req.status}: ${req.statusText}`);
            });
            req.addEventListener("abort", (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
                handlers?.abort?.call(null, e);
                reject(`XHR Error ${req.status}: ${req.statusText}`);
            });

            req.open(method, url);
            req.send(data || null);
        });
    }

    private _buildURL(api: string, argv?: any): string {
        // URL cannot be built if token is empty.
        if (!this.token) {
            throw new Error("Token is required for XHR.");
        }
        // url path.
        let url = api.charAt(0) === "/" ? api : this.API_HOST + this.API_BASE + "/" + api;
        // add token
        argv = argv || {};
        argv.s = this.token;
        // add timestamp
        argv.t = "t" + String(Date.now());
        // append arguments to URL
        if (argv instanceof Object) {
            const argStr = Object.keys(argv)
                .map((key) => {
                    const val = String(argv[key]).trim();
                    if (val && val !== "null" && val !== "undefined") {
                        return `${key}=${val}`;
                    } else return "";
                })
                .filter((p) => !!p)
                .join("&");
            if (argStr) url = url + "?" + argStr;
        }
        return url;
    }
}
const xhr = new XHR();
export default xhr;
