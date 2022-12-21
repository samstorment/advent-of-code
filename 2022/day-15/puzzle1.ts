// deno run -A .\main.ts

import { draw, getInput, Grid, Point } from "../ts-utils/util.ts";
import { getDistance, getSensorsAndBeacons, Group, stringify } from "./shared.ts";

const input = await getInput(15);

const { list, sensors, beacons } = getSensorsAndBeacons(input);

function getGroupCoverage(group: Group, line: number): Point[] {
    const { sensor: s, beacon: b } = group;

    const d = getDistance(s, b);

    const distanceToSensor = Math.abs(line - s.y);

    if (distanceToSensor > d) return [];

    const pointOffset = d - distanceToSensor;

    const coveredPoints: Point[] = [];

    for (let i = s.x - pointOffset; i <= s.x + pointOffset; i++) {
        const point = { x: i, y: line };

        if (sensors.has(stringify(point)) || beacons.has(stringify(point))) {
            continue;
        }

        coveredPoints.push({ x: i, y: line });
    }

    return coveredPoints;
}

function getTotalCovered(line: number) {
    const covered = new Set<string>();

    list.forEach(g => {
        const points = getGroupCoverage(g, line);
        points.forEach(p => covered.add(stringify(p)));
    });

    return covered;
}

function puzzle1() {
    console.log("Puzzle 1", getTotalCovered(2000000).size);
}

puzzle1();