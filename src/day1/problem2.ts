import { readFileSync } from "node:fs"

function handleOverflow(count: number): number {
    return ((count % 100) + 100) % 100;
}

export async function run(): Promise<number> {
    const fileContents: string = readFileSync('src/day1/p1Input.txt', 'utf-8')
    const lines: string[] = fileContents.split(/\r?\n/);

    let count: number = 50;
    let answer = 0;

    // Helper: count how many times the dial lands on 0 while moving
    function countZeroCrossings(start: number, isLeft: boolean, distance: number): number {
        if (distance <= 0) return 0;

        // For right (increasing) moves, the first positive click that lands on 0
        // is at k0 = (100 - start) % 100, but if that's 0 the first is at 100.
        // For left (decreasing) moves, the first positive k that lands on 0 is k0 = start % 100 (or 100 if 0).
        let k0 = isLeft ? (start % 100) : ((100 - start) % 100);
        if (k0 === 0) k0 = 100;

        if (distance < k0) return 0;
        return 1 + Math.floor((distance - k0) / 100);
    }

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (line === "") continue;

        const isLeft: boolean = line.charAt(0) === "L";
        const num: number = parseInt(line.substring(1), 10);

        // Add how many times we land on 0 during this movement
        answer += countZeroCrossings(count, isLeft, num);

        // Update current position and normalize
        if (isLeft) count -= num; else count += num;
        count = handleOverflow(count);
    }

    return answer;
}