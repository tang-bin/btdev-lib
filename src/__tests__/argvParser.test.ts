import argvParser from "../cmd/argvParser.node";

function addArgv(args: string[]): string[] {
    return ["bin/node", "main.js", ...args];
}

describe("ArgvParser", () => {
    beforeEach(() => {});

    test("Build and patch to one IP", () => {
        argvParser.parse(addArgv(["-bp", "1.1.1.1"]));
        expect(argvParser.has("build")).toBe(true);
        expect(argvParser.has("patch")).toBe(true);
    });

    test("Patch to two IPs", () => {
        argvParser.parse(addArgv(["-p", "1.1.1.1", "2.2.2.2"]));
        expect(argvParser.has("patch")).toBe(true);
        expect(argvParser.getMultiple("patch")).toEqual(["1.1.1.1", "2.2.2.2"]);
    });

    test("Specify password", () => {
        argvParser.parse(addArgv(["--passwd", "abc-123*11"]));
        expect(argvParser.has("passwd")).toBe(true);
        expect(argvParser.get("passwd")).toBe("abc-123*11");
    });
});
