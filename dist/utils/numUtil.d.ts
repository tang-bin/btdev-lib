declare class NumUtil {
    format(value: number | string, formatType: string, decimal?: number): string;
    formatBytes(bytes: number, unit?: string, decimal?: number): string;
    formatBps(bps: number, unit: string, base: string, decimal?: number): string;
    trimZeroAndNineTail(val: number | string): number | string;
    distance(x1: number, y1: number, x2: number, y2: number): number;
    randNum(min?: number, max?: number, decimal?: number): number;
    randInt(max: number): number;
}
declare const numUtil: NumUtil;
export default numUtil;
