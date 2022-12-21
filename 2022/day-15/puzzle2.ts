// deno run -A .\puzzle2.ts
import { getTrimmedLines, Point } from "../ts-utils/util.ts";
import { getDistance, getSensorsAndBeacons, Group, stringify } from "./shared.ts";

const input = await getTrimmedLines('./input.txt');

const { list, sensors: sensorSet, beacons: beaconSet } = getSensorsAndBeacons(input);

type Beacon = Point & {
    distance: number
}

type LineRange = Array<Array<Range>>;

export type Range = [number, number];

type BeaconData = {
    x: number;
    y: number;
    distance: number;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

const beaconList: Beacon[] = [];

list.forEach(({ sensor: s, beacon: b }) => {
    const d = getDistance(s, b);
    
    const i = beaconList.findIndex(p => p.x === b.x && p.y === b.y);

    if (i < 0) beaconList.push({ ...b, distance: d });
    else beaconList[i].distance = Math.max(beaconList[i].distance, d);
});



// const size = 20;
const mult = 4_000_000;
const size = 4_000_000;

function find(): Point {
    // const { sensor: s, beacon: b } = list[0];

    for (const { sensor: s, beacon: b } of list) {
        const d = getDistance(s,b);

        const perim = (d + 1);

        const minY = s.y - perim;
        const maxY = s.y + perim;

        for (let y = minY; y <= maxY; y++) {
            if (y < 0 || y > size) continue;

            const yOffset = getDistance(s, { x: s.x, y });
            const xOffset = (perim - yOffset);

            const min = { x: s.x - xOffset, y };
            const max = { x: s.x + xOffset, y };
   
            if (min.x < 0 || min.x > size) continue;
            if (max.x < 0 || max.x > size) continue;

            let minCovered = false;
            let maxCovered = false;

            for (const { sensor, beacon } of list) {
                if (minCovered && maxCovered) break;

                const sensorToBeacon = getDistance(sensor, beacon);
                
                if (getDistance(min, sensor) <= sensorToBeacon) {
                    minCovered = true;
                }
                if (getDistance(max, sensor) <= sensorToBeacon) {
                    maxCovered = true;
                }
            }

            if (!minCovered) return min;
            if (!maxCovered) return max;
        }
    }

    // point outside of search range
    return { x: 1, y: -1 };
}

const point = find();

console.log("Puzzle 2:", point.x * mult + point.y);