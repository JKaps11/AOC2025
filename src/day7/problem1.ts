import { readFileSync } from "node:fs";
import { Logger } from "../logger/Logger";

function testBeams(beamIdx: number[], line: string, logger: Logger): void {
    const expected: number[] = []
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '|') expected.push(i)
    }

    let test: boolean = beamIdx.length > 0 && beamIdx.every((idx) => expected.includes(idx))

    if (test) {
        logger.info("Succesful beam test")
    } else {
        logger.error(`Beam test failed. Expected: ${expected}, Actual: ${beamIdx}`)
    }

}

export async function run(logger: Logger): Promise<number> {
    const fileContents: string = readFileSync('src/day7/input.txt', 'utf-8');
    const lines: string[] = fileContents.split(/\r?\n/);

    let sIdx: number | undefined = lines[0]?.indexOf("S")
    if (!sIdx) throw new Error("Sidx not found");
    let curBeamIdxs: number[] = [sIdx]
    let numSplits: number = 0;

    lines.forEach((line, linesIdx) => {
        if (linesIdx % 2 == 1) {
            // testBeams(curBeamIdxs, line, logger);
            return
        };
        logger.debug(`Line ${linesIdx}: ${line} with beam idxs ${curBeamIdxs}`)

        const beamsToUpdate: Set<number> = new Set()
        curBeamIdxs.forEach((beamIdx, removeIdx) => {
            if (linesIdx === 4) logger.debug(`Beam ${beamIdx} with ${line[beamIdx]} below it`);
            if (line[beamIdx] === '^') {
                logger.debug(`Split number: ${numSplits + 1} for beamIdx: ${beamIdx}`)
                if (beamIdx !== 0) beamsToUpdate.add(beamIdx - 1);
                if (beamIdx !== line.length - 1) beamsToUpdate.add(beamIdx + 1);

                numSplits++;
            } else {
                beamsToUpdate.add(beamIdx)
            }
        })

        curBeamIdxs = []

        logger.debug(`Beams to update: ${[...beamsToUpdate]}\n`)
        beamsToUpdate.forEach((beam) => {
            curBeamIdxs.push(beam)
        })

    })

    return numSplits;
}
