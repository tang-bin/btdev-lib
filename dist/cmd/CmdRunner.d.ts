import Model from "../data/Model";
export default class CmdRunner extends Model {
    private _data;
    constructor(data: any);
    trace(): void;
    run(options?: any): Promise<number>;
}
