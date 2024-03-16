export default class Model {
    private _$handlers;
    get $handlers(): {
        [key: string]: Function[];
    };
    get $ClassName(): string;
    constructor();
    on(eventName: string, handler: Function, exclusive?: boolean): void;
    off(eventName: string, handler?: Function): void;
    offAll(): void;
    emit(eventName: string, ...argv: any): void;
    copyAllEventsFrom(target: Model, combine?: boolean, kept?: boolean): void;
}
