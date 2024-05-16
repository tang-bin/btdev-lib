"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_node_1 = __importDefault(require("../cmd/cmd.node"));
describe("cmd", () => {
    beforeEach(() => {
        cmd_node_1.default.verbal = true;
    });
    test("run a single cmd", () => {
        cmd_node_1.default.exec("ls");
    });
    test("run a serial of cmds", () => {
        cmd_node_1.default.exec(["ls", "pwd", "echo hello"]);
    });
    test("run a cmd with title", () => {
        cmd_node_1.default.exec("echo with title", process.cwd(), "this is a title");
    });
});
