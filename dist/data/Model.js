export default class Model {
    _$handlers = {};
    get $handlers() {
        return this._$handlers;
    }
    get $ClassName() {
        return "Model";
    }
    constructor() { }
    on(eventName, handler, exclusive = false) {
        const e = eventName.trim(), hs = this._$handlers;
        if (e) {
            if (exclusive || !hs[e]) {
                hs[e] = [handler];
            }
            else if (!hs[e].includes(handler)) {
                hs[e].push(handler);
            }
        }
    }
    off(eventName, handler) {
        const e = eventName.trim(), hs = this._$handlers;
        if (e) {
            if (hs[e]) {
                if (handler) {
                    hs[e] = hs[e].filter((h) => h !== handler);
                }
                else {
                    delete hs[e];
                }
            }
        }
    }
    offAll() {
        this._$handlers = {};
    }
    emit(eventName, ...argv) {
        const e = eventName.trim(), hs = this._$handlers;
        (hs[e] || []).forEach((h) => {
            h.call(this, ...argv);
        });
    }
    copyAllEventsFrom(target, combine, kept) {
        this._$handlers = target.$handlers;
        // combine has not implemented yet.
        if (!kept)
            target.offAll();
    }
}
