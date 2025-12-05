import { readFileSync } from "node:fs";

export async function run(): Promise<number> {
    const fileContents: string = readFileSync('src/day5/input.txt', 'utf-8');
    const lines: string[] = fileContents.split(/\r?\n/);

    let numFresh: number = 0;

    const inclusiveRanges: { start: number, end: number }[] = [];

    let idx: number = 0
    for (const line of lines) {
        idx++;
        if (line.length === 0) {
            break;
        }

        const [start, end] = line.split('-')
        inclusiveRanges.push({ start: Number(start), end: Number(end) });
    }

    for (let i = idx; i < lines.length; i++) {
        const num = Number(lines[i]);

        for (const { start, end } of inclusiveRanges) {
            if (start <= num && num <= end) {
                numFresh++;
                break;
            }
        }
    }

    return numFresh;
}
