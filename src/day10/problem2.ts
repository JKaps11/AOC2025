import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const GLPK = require("glpk.js");
const glpk = GLPK();

type Machine = { goal: number[]; buttons: number[][] };

function parseMachines(input: string): Machine[] {
    const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    return lines.map((line) => {
        const goalMatch = line.match(/\{([^}]*)\}/);
        if (!goalMatch) throw new Error(`No {goal} found: ${line}`);

        const goal = goalMatch[1]!
            .split(",")
            .map((s) => Number(s.trim()))
            .filter((n) => Number.isFinite(n));

        const buttons = [...line.matchAll(/\(([^)]*)\)/g)].map((m) =>
            m[1]!
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
                .map((s) => Number(s))
        );

        // validate button indices are in range of goal length
        for (const b of buttons) {
            for (const idx of b) {
                if (!Number.isInteger(idx) || idx < 0 || idx >= goal.length) {
                    throw new Error(`Button index ${idx} out of range (goalLen=${goal.length}) in: ${line}`);
                }
            }
        }

        return { goal, buttons };
    });
}

function minPressesMILP(goal: number[], buttons: number[][]): number {
    const m = goal.length;
    const n = buttons.length;

    // quick infeasible check: any required counter never touched
    const touched = new Array<boolean>(m).fill(false);
    for (const b of buttons) for (const idx of b) touched[idx] = true;
    for (let i = 0; i < m; i++) {
        if (goal[i]! > 0 && !touched[i]) {
            throw new Error(`Unsolvable: counter ${i} needs ${goal[i]} but no button touches it`);
        }
    }

    const varNames = Array.from({ length: n }, (_, j) => `x${j}`);

    // constraints: for each counter i, sum_{j touches i} xj == goal[i]
    const subjectTo = Array.from({ length: m }, (_, i) => {
        const vars: { name: string; coef: number }[] = [];
        for (let j = 0; j < n; j++) {
            if (buttons[j]!.includes(i)) vars.push({ name: varNames[j]!, coef: 1 });
        }

        // If vars is empty, goal[i] must be 0 (otherwise we already threw above)
        return {
            name: `c${i}`,
            vars,
            bnds: { type: glpk.GLP_FX, lb: goal[i]!, ub: goal[i]! }, // equality
        };
    });

    // bounds: 0 <= xj <= min(goal[i] for i touched by j)
    // (tightening bounds makes the MILP MUCH faster)
    const bounds = Array.from({ length: n }, (_, j) => {
        const idxs = buttons[j]!;
        let ub = Infinity;
        for (const i of idxs) ub = Math.min(ub, goal[i]!);
        if (!Number.isFinite(ub)) ub = 0; // shouldn't happen; defensive
        return {
            name: varNames[j]!,
            type: glpk.GLP_DB, // double-bounded
            lb: 0,
            ub,
        };
    });

    const lp = {
        name: "factory-part2",
        objective: {
            direction: glpk.GLP_MIN,
            name: "presses",
            vars: varNames.map((name) => ({ name, coef: 1 })),
        },
        subjectTo,
        bounds,
        generals: varNames, // integer variables :contentReference[oaicite:2]{index=2}
    };

    const res = glpk.solve(lp, {
        msglev: glpk.GLP_MSG_OFF,
        presol: true,
    });

    if (res.result.status !== glpk.GLP_OPT) {
        throw new Error(`MILP failed: status=${res.result.status}`);
    }

    const z = res.result.z;
    const rounded = Math.round(z);
    if (Math.abs(z - rounded) > 1e-6) {
        throw new Error(`Objective not near-integer? z=${z}`);
    }
    return rounded;
}

export async function run(): Promise<number> {
    const fileContents = readFileSync("src/day10/input.txt", "utf-8");
    const machines = parseMachines(fileContents);

    let total = 0;
    for (const { goal, buttons } of machines) {
        total += minPressesMILP(goal, buttons);
    }
    return total;
}
