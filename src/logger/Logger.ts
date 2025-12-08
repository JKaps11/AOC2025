import chalk from "../../node_modules/chalk/source/index";
import type { LoggerConfig } from "./config";

export class Logger {
    private debugEnabled: boolean;
    private disabled: boolean = false;

    constructor(config: LoggerConfig) {
        this.debugEnabled = config.debug;
    }

    private ts(): string {
        // return chalk.gray(new Date().toISOString());
        return ""
    }

    disable() {
        this.disabled = true;
    }

    info(msg: string, ...args: any[]) {
        if (this.disabled) return;
        console.log(`${this.ts()} ${chalk.blueBright("INFO")}  ${msg}`, ...args);
    }

    warn(msg: string, ...args: any[]) {
        if (this.disabled) return;
        console.warn(`${this.ts()} ${chalk.yellow("WARN")}  ${msg}`, ...args);
    }

    error(msg: string, ...args: any[]) {
        if (this.disabled) return;
        console.error(`${this.ts()} ${chalk.red("ERROR")} ${msg}`, ...args);
    }

    debug(msg: string, ...args: any[]) {
        if (!this.debugEnabled || this.disabled) return;
        console.log(`${this.ts()} ${chalk.magenta("DEBUG")} ${msg}`, ...args);
    }
}
