import { readFileSync } from "node:fs";
import { Logger } from "../logger/Logger";

interface Coordinate {
    x: number;
    y: number;
}

interface Rectangle {
    c1: Coordinate;
    c2: Coordinate;
    c3: Coordinate;
    c4: Coordinate;
}

type Segment =
    | { kind: "H"; y: number; x1: number; x2: number }
    | { kind: "V"; x: number; y1: number; y2: number };

function pointInOrOnPolygon(pt: Coordinate, poly: Coordinate[]): boolean {
    const { x, y } = pt;
    let inside = false;

    // classic ray-casting with explicit boundary checks
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i]!.x,
            yi = poly[i]!.y;
        const xj = poly[j]!.x,
            yj = poly[j]!.y;

        // on horizontal edge
        if (
            yi === yj &&
            y === yi &&
            x >= Math.min(xi, xj) &&
            x <= Math.max(xi, xj)
        ) {
            return true;
        }

        // on vertical edge
        if (
            xi === xj &&
            x === xi &&
            y >= Math.min(yi, yj) &&
            y <= Math.max(yi, yj)
        ) {
            return true;
        }

        // ray cast to the right
        const intersects =
            (yi > y) !== (yj > y) &&
            x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

        if (intersects) inside = !inside;
    }

    return inside;
}

function getRectangleAreaBetweenCoords(c1: Coordinate, c2: Coordinate): number {
    const length: number = Math.abs(c1.x - c2.x) + 1;
    const width: number = Math.abs(c1.y - c2.y) + 1;
    return length * width;
}

function getOtherCorners(
    c1: Coordinate,
    c2: Coordinate
): { c3: Coordinate; c4: Coordinate } {
    const c3: Coordinate = { x: c1.x, y: c2.y };
    const c4: Coordinate = { x: c2.x, y: c1.y };
    return { c3, c4 };
}

function rectBounds(rect: Rectangle): {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
} {
    const xs = [rect.c1.x, rect.c2.x, rect.c3.x, rect.c4.x];
    const ys = [rect.c1.y, rect.c2.y, rect.c3.y, rect.c4.y];
    return {
        xmin: Math.min(...xs),
        xmax: Math.max(...xs),
        ymin: Math.min(...ys),
        ymax: Math.max(...ys),
    };
}

function buildSegments(poly: Coordinate[]): Segment[] {
    const segs: Segment[] = [];

    for (let i = 0; i < poly.length; i++) {
        const a = poly[i]!;
        const b = poly[(i + 1) % poly.length]!;
        if (a.x === b.x) {
            segs.push({
                kind: "V",
                x: a.x,
                y1: Math.min(a.y, b.y),
                y2: Math.max(a.y, b.y),
            });
        } else if (a.y === b.y) {
            segs.push({
                kind: "H",
                y: a.y,
                x1: Math.min(a.x, b.x),
                x2: Math.max(a.x, b.x),
            });
        } else {
            throw new Error(
                `Non-orthogonal edge: (${a.x},${a.y}) -> (${b.x},${b.y})`
            );
        }
    }

    return segs;
}

/**
 * Returns true if ANY boundary segment lies strictly inside the rectangle open interior.
 * (That’s exactly the concave “bite” case.)
 *
 * Open interior in continuous geometry:
 *   x in (xmin, xmax), y in (ymin, ymax)
 */
function boundaryEntersOpenRectInterior(
    segs: Segment[],
    xmin: number,
    xmax: number,
    ymin: number,
    ymax: number
): boolean {
    // No open interior if degenerate
    if (!(xmin < xmax && ymin < ymax)) return false;

    for (const s of segs) {
        if (s.kind === "H") {
            // horizontal segment at y = s.y
            if (ymin < s.y && s.y < ymax) {
                // overlap with (xmin, xmax) using strict inequality
                const left = Math.max(s.x1, xmin);
                const right = Math.min(s.x2, xmax);
                if (left < right) return true; // non-empty overlap in open interval
            }
        } else {
            // vertical segment at x = s.x
            if (xmin < s.x && s.x < xmax) {
                const bot = Math.max(s.y1, ymin);
                const top = Math.min(s.y2, ymax);
                if (bot < top) return true;
            }
        }
    }

    return false;
}

/**
 * Part 2 correct: rectangle must be fully contained in the filled red/green region.
 *
 * Necessary conditions we enforce:
 *  - all 4 corners are inside/on the polygon
 *  - rectangle midpoint is inside (ensures we’re in the filled region)
 *  - boundary does NOT enter the rectangle open interior (fixes concave corner-only false positives)
 */
function isEligibleRectanglePart2(
    rect: Rectangle,
    boundary: Coordinate[],
    segs: Segment[]
): boolean {
    // 1) corners inside/on
    const corners = [rect.c1, rect.c2, rect.c3, rect.c4];
    if (!corners.every((c) => pointInOrOnPolygon(c, boundary))) return false;

    const { xmin, xmax, ymin, ymax } = rectBounds(rect);

    // Degenerate (line) rectangles: keep it simple and safe:
    // sample midpoint on the line + reject if boundary crosses into its interior range.
    // (Max rectangles in this puzzle are virtually always non-degenerate.)
    if (!(xmin < xmax && ymin < ymax)) {
        const mid: Coordinate = { x: (xmin + xmax) / 2, y: (ymin + ymax) / 2 };
        return pointInOrOnPolygon(mid, boundary);
    }

    // 2) midpoint inside (continuous)
    const mid: Coordinate = { x: (xmin + xmax) / 2, y: (ymin + ymax) / 2 };
    if (!pointInOrOnPolygon(mid, boundary)) return false;

    // 3) boundary must not pass through open interior (concave bite killer)
    if (boundaryEntersOpenRectInterior(segs, xmin, xmax, ymin, ymax)) return false;

    return true;
}

export async function run(logger: Logger): Promise<number> {
    const fileContents: string = readFileSync("src/day9/input.txt", "utf-8");

    // IMPORTANT: trim + filter to avoid NaN coords from trailing newline
    const redRectangleCoords: Coordinate[] = fileContents
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
        .map((line) => {
            const [xs, ys] = line.split(",");
            const x = Number(xs);
            const y = Number(ys);
            if (!Number.isFinite(x) || !Number.isFinite(y)) {
                throw new Error(`Bad coord line: "${line}"`);
            }
            return { x, y };
        });

    const segs = buildSegments(redRectangleCoords);

    let maxRectangleSize = 0;

    for (let startCoord = 0; startCoord < redRectangleCoords.length; startCoord++) {
        for (let endCoord = startCoord + 1; endCoord < redRectangleCoords.length; endCoord++) {
            const c1 = redRectangleCoords[startCoord]!;
            const c2 = redRectangleCoords[endCoord]!;
            const { c3, c4 } = getOtherCorners(c1, c2);

            const area = getRectangleAreaBetweenCoords(c1, c2);
            if (area <= maxRectangleSize) continue; // cheap pruning

            if (!isEligibleRectanglePart2({ c1, c2, c3, c4 }, redRectangleCoords, segs)) continue;

            maxRectangleSize = area;
        }
    }

    return maxRectangleSize;
}
