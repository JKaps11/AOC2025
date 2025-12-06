import { readFileSync } from "node:fs";

export async function run(): Promise<number> {
    const fileContents: string = readFileSync('src/day6/input.txt', 'utf-8');
    const lines: string[] = fileContents.split(/\r?\n/);

    const numbersInProbem: number[][] = [];
    const operations: string = lines.pop()!.replace(/\s/g, '');

    for (let i = 0; i < operations.length; i++) numbersInProbem[i] = [];

    lines.forEach((line) => {
        line.split(' ').filter((val) => val !== ' ' && val !== '').forEach((val, idx) => {
            numbersInProbem[idx]?.push(Number(val))
        })
    })

    let answer: number = 0;

    numbersInProbem.forEach((problem, idx) => {
        const curOp = operations[idx]
        let solution: number = curOp === "+" ? 0 : 1

        problem.forEach((num, idx) => {
            switch (curOp) {
                case "+":
                    solution += num
                    break;
                case "*":
                    solution *= num
                    break;
            }
        })

        answer += solution
    })

    return answer;
}
