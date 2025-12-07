import * as path from "path";
import { pathToFileURL } from "url";
import { loadConfig } from "./logger/config";
import { Logger } from "./logger/Logger";

async function main() {
    const config = loadConfig();
    const logger = new Logger(config);

    const year = process.argv[2];
    const dayArg = process.argv[3] ?? "1";
    const day = String(Number(dayArg));
    const part = process.argv[4] ?? "part1";
    const partNum = part.toString().replace(/^part/i, "");

    const modulePath = path.resolve(
        process.cwd(),
        "src",
        `day${day}`,
        `problem${partNum}.ts`
    );

    const moduleUrl = pathToFileURL(modulePath).href;
    const mod = await import(moduleUrl);

    if (typeof mod.run !== "function") {
        logger.error(`Module ${modulePath} does not export 'run'`);
        process.exit(1)
    }

    const result = await mod.run(logger);
    if (result !== undefined) console.log(result);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});