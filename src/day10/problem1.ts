import { readFileSync } from "node:fs";
import { Logger } from "../logger/Logger";

function findMinButtonPressedPerMachine(
    goal: string,
    curMachineButtons: number[][]
): number {
    const startIndicators = goal.replaceAll('#', '.');
    const visited = new Set<string>();

    const queue = [{ indicators: startIndicators, presses: 0 }];
    visited.add(startIndicators);

    while (queue.length > 0) {
        const { indicators, presses } = queue.shift()!;

        if (indicators === goal) return presses;

        curMachineButtons.forEach(button => {
            let newIndicators = indicators.split('');
            button.forEach(idx => newIndicators[idx] = newIndicators[idx] === '#' ? '.' : '#')
            const nextIndicators = newIndicators.join('');

            if (!visited.has(nextIndicators)) {
                visited.add(nextIndicators);
                queue.push({
                    indicators: nextIndicators,
                    presses: presses + 1,
                });
            }
        })
    }

    return -1;
}


export async function run(logger: Logger): Promise<number> {
    const fileContents: string = readFileSync('src/day10/input.txt', 'utf-8');
    const lines: string[] = fileContents.split(/\r?\n/);

    const fewestPossbileButtonsPerMachine: number[] = []
    const indicatorGoalPerMachine: string[] = []
    const activatorPerButtonPerMachine: number[][][] = []

    let prevIdx: number = 0

    lines.forEach((line, lineIdx) => {
        activatorPerButtonPerMachine.push([])
        for (let charIdx = 0; charIdx < line.length; charIdx++) {
            const char: string = line[charIdx]!
            if (['[', '('].includes(char)) {
                prevIdx = charIdx;
                continue
            }

            if (char === ']') {
                indicatorGoalPerMachine.push(line.slice(prevIdx + 1, charIdx))
                fewestPossbileButtonsPerMachine.push(Number.MAX_SAFE_INTEGER)
                continue
            }

            if (char === ')') {
                activatorPerButtonPerMachine[lineIdx]?.push(line.slice(prevIdx + 1, charIdx).split(',').map(val => Number(val)))
            }
        }
    })

    indicatorGoalPerMachine.forEach((goal, machineIdx) => {
        fewestPossbileButtonsPerMachine[machineIdx]! = findMinButtonPressedPerMachine(goal, activatorPerButtonPerMachine[machineIdx]!)
    })

    return fewestPossbileButtonsPerMachine.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0)
}