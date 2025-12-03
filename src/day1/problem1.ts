import { readFileSync } from "node:fs"

function handleOverflow(count: number): number {
    // Ensure count is always within 0..99 using a robust modulo
    return ((count % 100) + 100) % 100;
}

export async function run(): Promise<number> {
    const fileContents: string = readFileSync('src/day1/p1Input.txt', 'utf-8')
    const lines: string[] = fileContents.split(/\r?\n/);

    let count: number = 50;
    let answer = 0;

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (line === "") continue;

        const isLeft: boolean = line.charAt(0) === "L";
        const num: number = parseInt(line.substring(1), 10);

        if (isLeft) {
            count -= num;
        } else {
            count += num;
        }

        count = handleOverflow(count);

        if (count === 0) answer++;
    }

    return answer;
}