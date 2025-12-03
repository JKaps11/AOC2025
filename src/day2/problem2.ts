import { readFileSync } from "node:fs";

function hasRepeatedSequence(num: string): boolean {
    let seqLen: number = 1;

    while (seqLen <= num.length / 2) {

        if (num.length % seqLen !== 0) {
            seqLen++;
            continue;
        }

        let isRepeatedSequence: boolean = true

        let seqToMatch = num.slice(0, seqLen)
        let currSeq = ""
        for (let i = seqLen; i < 1 + num.length - seqLen; i += seqLen) {
            currSeq = num.slice(i, i + seqLen)

            if (seqToMatch !== currSeq) {
                isRepeatedSequence = false
                break;
            }
        }

        if (isRepeatedSequence) return true

        seqLen++;
    }

    return false
}
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
            let startNum: number = Number(start);

            if (hasRepeatedSequence(start) || (start.length % 2 === 0 && start.slice(0, start.length / 2) === start.slice(start.length / 2))) {
                console.log(`invalid Id: ${start}`)
                invalidIdSum += startNum;
            }

            startNum++;
            start = startNum.toString();
        }

        return invalidIdSum
    })

    return invalidIdSum;
}