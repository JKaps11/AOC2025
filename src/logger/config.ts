// src/common/config.ts

export interface LoggerConfig {
    debug: boolean;
}

export function loadConfig(): LoggerConfig {
    const args = process.argv.slice(2);

    return {
        debug: args.includes("--debug") || args.includes("-d"),
    };
}
