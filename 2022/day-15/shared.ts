import { Point, getInput, getTrimmedLines, draw, Grid } from '../ts-utils/util.ts';



export type Group = {
    sensor: Point,
    beacon: Point
}

export function getSensorsAndBeacons(input: string[]) {

    function getPointFromText(text: string): Point {
        const [ _c, coordsText ] = text.split(' at ');
        const [ xAssign, yAssign ] = coordsText.split(', ');
        const [ _x, x ] = xAssign.split('=');
        const [ _y, y ] = yAssign.split('=');
        return { x: parseInt(x), y: parseInt(y) };
    }

    const sensors = new Set<string>();
    const beacons = new Set<string>();

    const list: Group[] = input.map(line => {
        const [ sensor, beacon ] = line.split(': ').map(getPointFromText);

        sensors.add(stringify(sensor));
        beacons.add(stringify(beacon));

        return { sensor, beacon }
    });

    return { list, sensors, beacons };
}

// manhattan distance
export function getDistance(a: Point, b: Point) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function stringify(p: Point) {
    return `${p.x},${p.y}`;
}