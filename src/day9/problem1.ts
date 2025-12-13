import { readFileSync } from "node:fs";
import { Logger } from "../logger/Logger";

interface Coordinate {
    x: number;
    y: number;
}

function getRectangleAreaBetweenCoords(c1: Coordinate, c2: Coordinate): number {
    const length: number = Math.abs(c1.x - c2.x) + 1;
    const width: number = Math.abs(c1.y - c2.y) + 1;
    return length * width;
}

export async function run(logger: Logger): Promise<number> {
    const fileContents: string = readFileSync('src/day9/input.txt', 'utf-8');
    const lines: string[] = fileContents.split(/\r?\n/);

    /** 0 indexed red rectangles coordinates */
    const redRectangleCoords: Coordinate[] = lines.map((line) => {
        const elements: string[] = line.split(',');
        if (elements.length != 2) logger.error("unexepcted length");
        return { x: Number(elements[0]), y: Number(elements[1]) }
    })

    let maxRectangleSize = 0;

    for (let startCoord = 0; startCoord < redRectangleCoords.length; startCoord++) {
        for (let endCoord = startCoord + 1; endCoord < redRectangleCoords.length; endCoord++) {
            const areaBetweenCoords: number = getRectangleAreaBetweenCoords(redRectangleCoords[startCoord]!, redRectangleCoords[endCoord]!);
            if (maxRectangleSize < areaBetweenCoords) maxRectangleSize = areaBetweenCoords;
        }
    }

    return maxRectangleSize;
}
