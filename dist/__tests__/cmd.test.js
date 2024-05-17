"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cmdUtil_node_1 = __importDefault(require("../cmd/cmdUtil.node"));
describe("cmd", () => {
    beforeEach(() => {
        cmdUtil_node_1.default.verbal = true;
    });
    test("run a single cmd", () => {
        cmdUtil_node_1.default.exec("ls");
    });
    test("run a serial of cmds", () => {
        cmdUtil_node_1.default.exec(["ls", "pwd", "echo hello"]);
    });
    test("run a cmd with title", () => {
        cmdUtil_node_1.default.exec("echo with title", process.cwd(), "this is a title");
    });
});
