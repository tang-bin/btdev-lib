declare class TimeUtil {
    formatDuring(time: number, useLabel?: boolean, takeHighest?: Boolean): string;
    formatDate(time: string | number, formatString?: string, dateFormat?: string): string;
}
declare const timeUtil: TimeUtil;
export default timeUtil;
