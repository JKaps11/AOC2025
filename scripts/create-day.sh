#!/bin/bash

# --- Validate argument ---
if [ -z "$1" ]; then
  echo "Usage: ./create-day.sh <dayNumber>"
  exit 1
fi

DAY="day$1"
DIR="src/$DAY"

# --- Create folder ---
mkdir -p "$DIR"

# --- Create files ---
touch "$DIR/problem1.ts"
touch "$DIR/problem2.ts"
touch "$DIR/input.txt"
touch "$DIR/test.txt"

# --- Write template into problem files ---
cat <<EOF > "$DIR/problem1.ts"
import { readFileSync } from "node:fs";
import { Logger } from "../logger/Logger";

export async function run(logger: Logger): Promise<number> {
    const fileContents: string = readFileSync('src/$DAY/test.txt', 'utf-8');
    const lines: string[] = fileContents.split(/\\r?\\n/);

    return 0;
}
EOF

cat <<EOF > "$DIR/problem2.ts"
import { readFileSync } from "node:fs";
import { Logger } from "../logger/Logger";

export async function run(logger: Logger): Promise<number> {
    const fileContents: string = readFileSync('src/$DAY/test.txt', 'utf-8');
    const lines: string[] = fileContents.split(/\\r?\\n/);

    return 0;
}
EOF

echo "Created $DIR with problem1.ts, problem2.ts, input.txt, and test.ts"
