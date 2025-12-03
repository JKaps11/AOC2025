import { readFileSync } from "node:fs";

function maxJoltageBank(bank: string): number {
    const bankLength: number = bank.length;

    let idxUsed: number = 0;
    let numOne: string = '';
    let numTwo: string = '';

    for (let i = 9; i > 0; i--) {
        let curIdx: number = 0
        for (const volt of bank) {
            if (volt === i.toString() && numOne === '' && curIdx !== bankLength - 1) {
                numOne = volt;
                idxUsed = curIdx
            } else if (volt === i.toString() && numTwo === '' && curIdx > idxUsed) {
                numTwo = volt;
            } else if (numOne !== '' && numTwo !== '') break;

            curIdx++;
        }
    }

    return Number(numOne + numTwo)
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