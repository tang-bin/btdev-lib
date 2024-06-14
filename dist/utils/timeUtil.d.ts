declare class TimeUtil {
    formatDuring(time: number, options?: {
        useLabel?: boolean;
        takeHighest?: Boolean;
        round?: string;
        separator?: string;
    }): string;
    formatDate(time: string | number, formatString?: string, dateFormat?: string): string;
}
declare const timeUtil: TimeUtil;
export default timeUtil;
