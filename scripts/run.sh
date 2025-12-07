#!/usr/bin/env bash

YEAR=2025

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <day> <1|2> [--debug]"
  exit 1
fi

DAY=$1
PART_NUM=$2
FLAG=$3   # may be empty

if [ "$PART_NUM" != "1" ] && [ "$PART_NUM" != "2" ]; then
  echo "Part must be 1 or 2."
  exit 1
fi

PART="part${PART_NUM}"

echo "Running: npm run dev -- ${YEAR} ${DAY} ${PART} ${FLAG}"
npm run dev -- ${YEAR} ${DAY} ${PART} ${FLAG}

