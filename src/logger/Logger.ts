import chalk from "../../node_modules/chalk/source/index";
import type { LoggerConfig } from "./config";

export class Logger {
    private debugEnabled: boolean;

    constructor(config: LoggerConfig) {
        this.debugEnabled = config.debug;
    }

    private ts(): string {
        // return chalk.gray(new Date().toISOString());
        return ""
    }

    info(msg: string, ...args: any[]) {
        console.log(`${this.ts()} ${chalk.blueBright("INFO")}  ${msg}`, ...args);
    }

    warn(msg: string, ...args: any[]) {
        console.warn(`${this.ts()} ${chalk.yellow("WARN")}  ${msg}`, ...args);
    }

    error(msg: string, ...args: any[]) {
        console.error(`${this.ts()} ${chalk.red("ERROR")} ${msg}`, ...args);
    }

    debug(msg: string, ...args: any[]) {
        if (!this.debugEnabled) return;
        console.log(`${this.ts()} ${chalk.magenta("DEBUG")} ${msg}`, ...args);
    }
}
