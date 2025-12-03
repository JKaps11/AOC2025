import { readFileSync } from "node:fs";

export async function run(): Promise<number> {
    let invalidIdSum: number = 0;
    const fileContents: string = readFileSync('src/day2/p2Input.txt', 'utf-8')
    const ranges: string[] = fileContents.split(',').map((range) => range.trim());

    ranges.forEach((range) => {
        const arr = range.split('-');
        if (arr.length !== 2) {
            throw new Error(`arr length not 2 ${range}`)
        }

        let start = arr[0]
        const end = arr[1]

        if (!start || !end) {
            throw new Error(`start or end wrong start: ${start}, end: ${end}`)
        }

        while (Number(start) <= Number(end)) {
            let temp: number = Number(start);

            if (start.length % 2 === 0 && start.slice(0, start.length / 2) === start.slice(start.length / 2)) {
                // console.log(`invalid Id: ${start}`)
                invalidIdSum += temp;
            }

            temp++;
            start = temp.toString();
        }

        return invalidIdSum
    })



    return invalidIdSum;
}