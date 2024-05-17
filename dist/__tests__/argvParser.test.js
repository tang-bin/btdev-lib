"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argvParser_node_1 = __importDefault(require("../cmd/argvParser.node"));
function addArgv(args) {
    return ["bin/node", "main.js", ...args];
}
describe("ArgvParser", () => {
    beforeEach(() => { });
    test("Build and patch to one IP", () => {
        argvParser_node_1.default.parse(addArgv(["-bp", "1.1.1.1"]));
        expect(argvParser_node_1.default.has("b")).toBe(true);
        expect(argvParser_node_1.default.has("p")).toBe(true);
    });
    test("Patch to two IPs", () => {
        argvParser_node_1.default.parse(addArgv(["-p", "1.1.1.1", "2.2.2.2"]));
        expect(argvParser_node_1.default.has("p")).toBe(true);
        expect(argvParser_node_1.default.getMultiple("p")).toEqual(["1.1.1.1", "2.2.2.2"]);
    });
    test("Specify password", () => {
        argvParser_node_1.default.parse(addArgv(["--passwd", "abc-123*11"]));
        expect(argvParser_node_1.default.has("passwd")).toBe(true);
        expect(argvParser_node_1.default.get("passwd")).toBe("abc-123*11");
    });
});
