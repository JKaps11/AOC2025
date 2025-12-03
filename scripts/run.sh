#!/usr/bin/env bash

# Usage: ./run.sh <day> <1|2>
# Example: ./run.sh 3 2   → runs day 3 part2

YEAR=2025

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <day> <1|2>"
  exit 1
fi

DAY=$1
PART_NUM=$2

# Validate part number is 1 or 2
if [ "$PART_NUM" != "1" ] && [ "$PART_NUM" != "2" ]; then
  echo "Part must be 1 or 2."
  exit 1
fi

PART="part${PART_NUM}"

echo "Running: npm run dev -- ${YEAR} ${DAY} ${PART}"
npm run dev -- ${YEAR} ${DAY} ${PART}
