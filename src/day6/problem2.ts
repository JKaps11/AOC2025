import { readFileSync } from "node:fs";

export async function run(): Promise<number> {
    const fileContents: string = readFileSync('src/day6/input.txt', 'utf-8');
    const lines: string[] = fileContents.split(/\r?\n/);

    const numbersInProbem: number[][] = [];
    const operations: string = lines.pop()!.replace(/\s/g, '');

    for (let i = 0; i < operations.length; i++) numbersInProbem[i] = [];

    let pIdx: number = 0;

    for (let i = 0; i < lines[0]?.length!; i++) {
        let numInProblem: string = ''
        for (let j = 0; j < lines.length; j++) {
            numInProblem += lines[j]![i];
        }

        if (numInProblem.trim() === "") {
            pIdx++;
            continue;
        }

        numbersInProbem[pIdx]?.push(Number(numInProblem))
    }

    let answer: number = 0;
    // console.log(numbersInProbem)
    numbersInProbem.forEach((problem, idx) => {
        const curOp = operations[idx]
        let solution: number = curOp === "+" ? 0 : 1

        problem.forEach((num) => {
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
