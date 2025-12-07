import { readFileSync } from "node:fs";
import { Logger } from "../logger/Logger";

export async function run(logger: Logger): Promise<number> {
    const fileContents: string = readFileSync("src/day7/test.txt", "utf-8");
    const lines: string[] = fileContents.split(/\r?\n/);

    const sIdx = lines[0]!.indexOf("S");
    if (sIdx === -1) throw new Error("S not found");

    // each beam index now holds number of timelines reaching it
    let beamIdxToNumTimelinesMapping: Map<number, number> = new Map([[sIdx, 1]]);

    lines.forEach((line, lineIdx) => {
        if (lineIdx % 2 === 1) return;

        logger.debug(`Line ${lineIdx}: ${line} with beams ${JSON.stringify([...beamIdxToNumTimelinesMapping])}`);

        const nextBeams: Map<number, number> = new Map();

        beamIdxToNumTimelinesMapping.forEach((timelineCount, colIdx) => {
            const ch = line[colIdx];

            if (ch === "^") {
                // SPLIT: left and right both inherit timelineCount
                const left = colIdx - 1;
                const right = colIdx + 1;

                logger.debug(`Splitter at col ${colIdx}. ${timelineCount} timelines split.`);

                if (left >= 0) {
                    nextBeams.set(left, (nextBeams.get(left) ?? 0) + timelineCount);
                }
                if (right < line.length) {
                    nextBeams.set(right, (nextBeams.get(right) ?? 0) + timelineCount);
                }
            } else {
                nextBeams.set(colIdx, (nextBeams.get(colIdx) ?? 0) + timelineCount);
            }
        });

        beamIdxToNumTimelinesMapping = nextBeams;
    });

    let totalTimelines = 0;
    beamIdxToNumTimelinesMapping.forEach((count) => (totalTimelines += count));

    return totalTimelines;
}
