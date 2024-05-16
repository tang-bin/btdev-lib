"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const confParser_node_1 = __importDefault(require("../cmd/confParser.node"));
describe("ConfParser", () => {
    beforeEach(() => {
        confParser_node_1.default.updateConf("a", "path/to/a");
        confParser_node_1.default.updateConf("x", "x/y/z");
    });
    test("Update regular path", () => {
        expect(confParser_node_1.default.get("a")).toBe("path/to/a");
        expect(confParser_node_1.default.get("x")).toBe("x/y/z");
    });
    test("Password with dash", () => {
        confParser_node_1.default.updateConf("passwd", "abc-def");
        expect(confParser_node_1.default.get("passwd")).toBe("abc-def");
    });
    test("Password with blank", () => {
        confParser_node_1.default.updateConf("passwd", "abc def");
        expect(confParser_node_1.default.get("passwd")).toBe("abc def");
    });
    test("Combined path with another attribute", () => {
        confParser_node_1.default.updateConf("a2", "/tmp/${a}");
        expect(confParser_node_1.default.get("a2")).toBe("/tmp/path/to/a");
    });
    test("Combined path with self", () => {
        confParser_node_1.default.updateConf("a", "/tmp/${}");
        expect(confParser_node_1.default.get("a")).toBe("/tmp/path/to/a");
    });
});
