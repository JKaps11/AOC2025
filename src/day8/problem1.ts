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
    logger.disable()
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

    // logger.debug(`Created junction boxes: ${junctionBoxes.map((box, idx) => `${idx}: ${JSON.stringify(box)}\n`)}`)

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

    // junctionBoxes.forEach((startJunctionBox, startJunctionBoxIdx) => {
    //     junctionBoxes.forEach((endJunctionBox, endJunctionBoxIdx) => {
    //         if (startJunctionBoxIdx === endJunctionBoxIdx || [...distanceToJunctionBoxConnectionMapping.values()].includes((pairs: Pair[]) => (pairs.includes((pair: Pair) => pair.startIdx === startJunctionBoxIdx && pair.endIdx === endJunctionBoxIdx))) {
    //             return;
    //         }
    //         const eDistance: number = euclideanDistance(startJunctionBox, endJunctionBox);

    //         if (distanceToJunctionBoxConnectionMapping.has(eDistance)) {
    //             distanceToJunctionBoxConnectionMapping.set(eDistance, distanceToJunctionBoxConnectionMapping.get(eDistance)!.concat({ startIdx: startJunctionBoxIdx, endIdx: endJunctionBoxIdx }))
    //         } else {
    //             distanceToJunctionBoxConnectionMapping.set(eDistance, [{ startIdx: startJunctionBoxIdx, endIdx: endJunctionBoxIdx }])
    //         }
    //     })
    // })

    // junctionBoxes.forEach((startJunctionBox, startJunctionBoxIdx) => {
    //     let minDistance: number = Number.MAX_SAFE_INTEGER;
    //     let chosenEndJunctionBoxIdx: number = -1;

    //     junctionBoxes.forEach((endJunctionBox, endJunctionBoxIdx) => {
    //         if (startJunctionBoxIdx === endJunctionBoxIdx) return;

    //         const eDistance: number = euclideanDistance(startJunctionBox, endJunctionBox);

    //         if (eDistance < minDistance) {
    //             minDistance = eDistance
    //             chosenEndJunctionBoxIdx = endJunctionBoxIdx
    //         }
    //     })

    //     if (chosenEndJunctionBoxIdx === -1) logger.error("Unexpected state reached");

    //     logger.debug(`Junction box ${startJunctionBoxIdx}: ${JSON.stringify(junctionBoxes[startJunctionBoxIdx])} is being combined with junction box ${chosenEndJunctionBoxIdx}: ${JSON.stringify(junctionBoxes[chosenEndJunctionBoxIdx])} Distance: ${minDistance}`)

    //     if (distanceToJunctionBoxConnectionMapping.has(minDistance)) {
    //         distanceToJunctionBoxConnectionMapping.set(minDistance, distanceToJunctionBoxConnectionMapping.get(minDistance)!.concat([startJunctionBoxIdx, chosenEndJunctionBoxIdx]))
    //     }

    //     distanceToJunctionBoxConnectionMapping.set(minDistance, [[startJunctionBoxIdx, chosenEndJunctionBoxIdx]])
    // })


    // 3. Sort by smallest distance
    logger.info(`Sorting junction box connections by distance...`)
    const sortedDistances: number[] = [...distanceToJunctionBoxConnectionMapping.keys()].sort((a, b) => a - b)

    let numDone: number = 0;

    // 4. Create the circuit between the corresponding junction boxes
    logger.info(`Creating circuits from junction box connections...`)
    sortedDistances.forEach((distance) => {
        const idxPairings: Pair[] = distanceToJunctionBoxConnectionMapping.get(distance)!;
        idxPairings.forEach((pair) => {
            if (numDone > 999) return;
            // logger.debug(`Processing junction box pair at distance ${distance}: ${JSON.stringify(pair)}`)
            const { startIdx: startJunctionBoxIdx, endIdx: endJunctionBoxIdx } = pair;

            logger.debug(`Junction box ${startJunctionBoxIdx}: ${JSON.stringify(junctionBoxes[startJunctionBoxIdx])} is being combined with junction box ${endJunctionBoxIdx}: ${JSON.stringify(junctionBoxes[endJunctionBoxIdx])}`)

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

            numDone++;

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



    // 5. Get the 3 largest circuits with their size and multiply the sizes
    logger.info(`Calculating largest circuits...`)
    const maxCircuitSizes: [number, number, number] = [1, 1, 1];
    circuits.forEach((circuit) => {
        const circuitLength: number = circuit.length;

        if (circuitLength > maxCircuitSizes[0]) {
            let temp0: number = maxCircuitSizes[0]
            let temp1: number = maxCircuitSizes[1]
            maxCircuitSizes[0] = circuitLength
            maxCircuitSizes[1] = temp0;
            maxCircuitSizes[2] = temp1;
        }

        else if (circuitLength > maxCircuitSizes[1]) {
            let temp1: number = maxCircuitSizes[1]
            maxCircuitSizes[1] = circuitLength
            maxCircuitSizes[2] = temp1
        }

        else if (circuitLength > maxCircuitSizes[2]) maxCircuitSizes[2] = circuitLength
    })

    logger.debug(`${maxCircuitSizes}`)
    return maxCircuitSizes.reduce((acc, n) => acc * n, 1);
}
