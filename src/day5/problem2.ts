import { readFileSync } from "node:fs";

export async function run(): Promise<number> {
    const fileContents = readFileSync('src/day5/test.txt', 'utf-8');
    const lines = fileContents.split(/\r?\n/).filter(Boolean);

    const ranges: Array<[number, number]> = [];

    for (const line of lines) {
        const [startStr, endStr] = line.split('-');
        const start = Number(startStr);
        const end = Number(endStr);

        if (isNaN(start) || isNaN(end)) {
            continue;
        }

        ranges.push([start, end]);
    }

    ranges.sort((a, b) => a[0] - b[0]);

    let total = 0;
    if (ranges.length === 0) return 0;

    let [currStart, currEnd] = ranges[0]!;

    for (let i = 1; i < ranges.length; i++) {
        const [s, e] = ranges[i]!;

        if (s > currEnd + 1) {
            total += currEnd - currStart + 1;
            currStart = s;
            currEnd = e;
        } else {
            currEnd = Math.max(currEnd, e);
        }
    }

    total += currEnd - currStart + 1;

    return total;
}
