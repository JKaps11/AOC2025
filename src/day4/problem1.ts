import { readFileSync } from "node:fs";

export async function run(): Promise<number> {
    const fileContents = readFileSync("src/day4/input.txt", "utf-8");
    const lines = fileContents.split(/\r?\n/);

    const height = lines.length;
    let rolesOfPaper = 0;

    const dirs = [
        [-1,  0], // up
        [ 1,  0], // down
        [ 0, -1], // left
        [ 0,  1], // right
        [-1, -1], // up-left
        [-1,  1], // up-right
        [ 1, -1], // down-left
        [ 1,  1], // down-right
    ];

    for (let r = 0; r < height; r++) {
        const row = lines[r];
        for (let c = 0; c < row!.length; c++) {
            if (row![c] !== "@") continue;

            let count = 0;

            for (const [dr, dc] of dirs) {
                const nr = r + dr!;
                const nc = c + dc!;

                if (
                    nr >= 0 &&
                    nr < height &&
                    nc >= 0 &&
                    nc < lines[nr]!.length &&
                    lines[nr]![nc] === "@"
                ) {
                    count++;
                }
            }

            if (count < 4) {
                rolesOfPaper++;
            }
        }
    }

    return rolesOfPaper;
}
