export default class Model {
    private _$handlers: { [key: string]: Function[] } = {};

    public get $handlers(): { [key: string]: Function[] } {
        return this._$handlers;
    }

    public get $ClassName(): string {
        return "Model";
    }

    constructor() {}

    public on(eventName: string, handler: Function, exclusive: boolean = false): void {
        const e = eventName.trim(),
            hs = this._$handlers;
        if (e) {
            if (exclusive || !hs[e]) {
                hs[e] = [handler];
            } else if (!hs[e].includes(handler)) {
                hs[e].push(handler);
            }
        }
    }

    public off(eventName: string, handler?: Function): void {
        const e = eventName.trim(),
            hs = this._$handlers;
        if (e) {
            if (hs[e]) {
                if (handler) {
                    hs[e] = hs[e].filter((h) => h !== handler);
                } else {
                    delete hs[e];
                }
            }
        }
    }

    public offAll(): void {
        this._$handlers = {};
    }

    public emit(eventName: string, ...argv: any) {
        const e = eventName.trim(),
            hs = this._$handlers;
        (hs[e] || []).forEach((h) => {
            h.call(this, ...argv);
        });
    }

    public copyAllEventsFrom(target: Model, combine?: boolean, kept?: boolean): void {
        this._$handlers = target.$handlers;
        // combine has not implemented yet.
        if (!kept) target.offAll();
    }
}
