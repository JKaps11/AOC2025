import { readFileSync } from "node:fs";
import { Logger } from "../logger/Logger";

interface Coordinate3D {
    x: number;
    y: number;
    z: number;
}

interface Pair {
    startIdx: number;
    endIdx: number;
}

function euclideanDistance(cStart: Coordinate3D, cEnd: Coordinate3D): number {
    let xDistance: number = cEnd.x - cStart.x
    let yDistance: number = cEnd.y - cStart.y
    let zDistance: number = cEnd.z - cStart.z

    let squaredSums: number = xDistance ** 2 + yDistance ** 2 + zDistance ** 2

    return Math.sqrt(squaredSums);
}

export async function run(logger: Logger): Promise<number> {
    const fileContents: string = readFileSync('src/day8/input.txt', 'utf-8');
    const lines: string[] = fileContents.split(/\r?\n/);

    const junctionBoxes: Coordinate3D[] = []
    const distanceToJunctionBoxConnectionMapping: Map<number, Pair[]> = new Map();
    const circuits: number[][] = []

    // 1. Form Junction Boxes with coords. Ids will be idx of list
    logger.info(`Creating junction boxes from input data...`)
    lines.forEach((illFormatedJunctionBoxCoords) => {
        const coords: string[] = illFormatedJunctionBoxCoords.split(',')
        junctionBoxes.push({
            x: Number(coords[0]),
            y: Number(coords[1]),
            z: Number(coords[2])
        })
    })

    // 2. Find the corresponding junction box with the smallest euclidean distance and add to our mapping
    logger.info(`Getting distances for all possible junction box combinations...`)
    for (let startJunctionBoxIdx = 0; startJunctionBoxIdx < junctionBoxes.length; startJunctionBoxIdx++) {
        for (let endJunctionBoxIdx = startJunctionBoxIdx + 1; endJunctionBoxIdx < junctionBoxes.length; endJunctionBoxIdx++) {
            if (startJunctionBoxIdx === endJunctionBoxIdx) continue;
            const eDistance: number = euclideanDistance(junctionBoxes[startJunctionBoxIdx]!, junctionBoxes[endJunctionBoxIdx]!);

            if (distanceToJunctionBoxConnectionMapping.has(eDistance)) {
                distanceToJunctionBoxConnectionMapping.set(eDistance, distanceToJunctionBoxConnectionMapping.get(eDistance)!.concat({ startIdx: startJunctionBoxIdx, endIdx: endJunctionBoxIdx }))
            } else {
                distanceToJunctionBoxConnectionMapping.set(eDistance, [{ startIdx: startJunctionBoxIdx, endIdx: endJunctionBoxIdx }])
            }
        }
    }

    // 3. Sort by smallest distance
    logger.info(`Sorting junction box connections by distance...`)
    const sortedDistances: number[] = [...distanceToJunctionBoxConnectionMapping.keys()].sort((a, b) => a - b)

    // 4. Keep creating circuits between pairs of junction boxes until all are connected in 1 circuit. Then return 2 last ones x1*x2
    let answer: number = -1;
    logger.info(`Creating circuits from junction box connections...`)
    sortedDistances.forEach((distance) => {
        if (answer !== -1) return;
        const idxPairings: Pair[] = distanceToJunctionBoxConnectionMapping.get(distance)!;
        idxPairings.forEach((pair) => {
            const { startIdx: startJunctionBoxIdx, endIdx: endJunctionBoxIdx } = pair;

            const circuitJBStartIdx: number = circuits.findIndex((circuit) => circuit.includes(startJunctionBoxIdx))
            const circuitJBEndIdx: number = circuits.findIndex((circuit) => circuit.includes(endJunctionBoxIdx))

            if (circuitJBStartIdx === -1 && circuitJBEndIdx === -1) {
                circuits.push([startJunctionBoxIdx, endJunctionBoxIdx])
            }

            else if (circuitJBStartIdx === -1) {
                circuits[circuitJBEndIdx]!.push(startJunctionBoxIdx)
            }

            else if (circuitJBEndIdx === -1) {
                circuits[circuitJBStartIdx]!.push(endJunctionBoxIdx)
            }

            else {
                if (circuitJBStartIdx !== circuitJBEndIdx) {
                    circuits[circuitJBStartIdx] = circuits[circuitJBStartIdx]!.concat(circuits[circuitJBEndIdx]!)
                    circuits.splice(circuitJBEndIdx, 1)
                }
            }

            if (circuits.length === 1 && junctionBoxes.every((_, jbIdx) => circuits[0]!.includes(jbIdx))) {
                logger.info(`All junction boxes connected into single circuit.`)
                logger.debug(`Ended up on junction boxes: ${JSON.stringify(junctionBoxes[startJunctionBoxIdx])} and ${JSON.stringify(junctionBoxes[endJunctionBoxIdx])}`)
                answer = junctionBoxes[startJunctionBoxIdx]!.x * junctionBoxes[endJunctionBoxIdx]!.x
                return;
            }

            logger.debug(
                `Circuit combination attempt: ` +
                `${circuitJBStartIdx === -1 && circuitJBEndIdx === -1
                    ? "created new circuit"
                    : circuitJBStartIdx === -1
                        ? `added start JB to circuit ${circuitJBEndIdx}`
                        : circuitJBEndIdx === -1
                            ? `added end JB to circuit ${circuitJBStartIdx}`
                            : circuitJBStartIdx !== circuitJBEndIdx
                                ? `merged circuit ${circuitJBEndIdx} into ${circuitJBStartIdx}`
                                : "both JBs already in same circuit; no change"
                }`
            );
            logger.debug(`Current circuits: ${JSON.stringify(circuits)}\n`)
        })
    })

    if (answer === -1) logger.error(`Failed to connect all junction boxes into single circuit.`)

    return answer;
}
