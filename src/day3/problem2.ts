import { readFileSync } from "node:fs";

function maxJoltageBank(batteryBank: string): number {
    const bankLength = batteryBank.length - 1;
    const NUM_BATTERIES_TO_SELECT = 12;

    const resultDigits: string[] = Array(NUM_BATTERIES_TO_SELECT).fill("");
    const batteryIdxsUsed: number[] = Array(NUM_BATTERIES_TO_SELECT).fill(-1);

    for (let choice = 0; choice < NUM_BATTERIES_TO_SELECT; choice++) {
        const prevIdx = choice === 0 ? -1 : batteryIdxsUsed[choice - 1];
        const remainingSlots = NUM_BATTERIES_TO_SELECT - choice - 1;
        const minIdx = prevIdx! + 1;
        const maxIdx = bankLength - remainingSlots;

        let bestDigit = -1;
        let bestIdx = minIdx;

        for (let i = minIdx; i <= maxIdx; i++) {
            const d = Number(batteryBank[i]);
            if (d > bestDigit) {
                bestDigit = d;
                bestIdx = i;
            }
        }

        batteryIdxsUsed[choice] = bestIdx;
        resultDigits[choice] = String(bestDigit);
    }

    return Number(resultDigits.join(""));
}

export async function run(): Promise<number> {
    const fileContents: string = readFileSync('src/day3/p3Input.txt', 'utf-8')
    const lines: string[] = fileContents.split(/\r?\n/);

    let maxJoltage: number = 0

    lines.forEach((line) => {
        maxJoltage += maxJoltageBank(line)
    })

    return maxJoltage
}