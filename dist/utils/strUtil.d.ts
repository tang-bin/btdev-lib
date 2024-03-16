declare class StrUtil {
    rand(len?: number): string;
    endsWith(searchIn: string, lookingFor: string, caseInsensitive?: boolean): boolean;
    endsWithList(searchIn: string, lookingFor: string[], caseInsensitive?: boolean): boolean;
    startsWith(searchIn: string, lookingFor: string): boolean;
    identifyName(name: string): string;
    camel2Dash(camel: string): string;
    parseParams(str: string): {
        [key: string]: string;
    };
    includes(long: string, short: string): boolean;
    splitClause(str: string): Array<string>;
    findAttributesFromExpression(expStr: string): Array<String>;
    labelling(str: string): string;
    capitalFirst(str: string): string;
    /**
     * @param text
     * @param len
     * @param splitWord:Boolean. Only split text on space.
     * @param greedy:Boolean. If splitWord is true, greedy will include next word even the result length is longer than len.
     */
    shortenText(text: string, len: number, splitWord?: boolean, greedy?: boolean): string;
    parseKeyValueStr(str: string): {
        [key: string]: string;
    };
    findNearestBreak(str: string, nearIndex: number): number;
    splitCSVRow(str: string): string[];
    findBracketRange(str: string, start?: string, end?: string): {
        startIndex: number;
        endIndex: number;
    };
    hexEncode(str: string, dec?: number, digit?: number): string;
    /**
     * Prettify the label. e.g.,
     * 1. this_is_a_label => This Is A Label
     * 2. srcHostName => Src Host Name
     * 3. another_goodToKnow_example => Another Good To Know Example
     *
     * @param label The label will be formatted.
     * @returns
     */
    prettifyLabel(label: string): string;
}
declare const strUtil: StrUtil;
export default strUtil;
