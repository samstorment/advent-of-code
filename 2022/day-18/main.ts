import { getInput, getTrimmedLines, sum } from '../ts-utils/util.ts';


// const input = await getInput(18);
const input = await getTrimmedLines('./input.txt');

type Cube = { x: number, y: number, z: number };
 
function getCubes() {
    const cubes: Cube[] = [];

    for (const line of input) {
        const [ x, y, z ] = line.split(',').map(n => parseInt(n));
        cubes.push({ x, y, z });
    }

    return cubes;
}

function stringify(cube: Cube) {
    return `${cube.x},${cube.y},${cube.z}`;
}

const top   = (c: Cube) => ({ ...c, z: c.z + 1});
const bot   = (c: Cube) => ({ ...c, z: c.z - 1});
const right = (c: Cube) => ({ ...c, x: c.x + 1});
const left  = (c: Cube) => ({ ...c, x: c.x - 1});
const front = (c: Cube) => ({ ...c, y: c.y - 1});
const back  = (c: Cube) => ({ ...c, y: c.y + 1});

function getExposedFaces(cubes: Cube[]) {
    return cubes.map((cube, index) => {
        let exposedFaces = 6;

        cubes.forEach(({x, y, z}, i) => {
            if (i === index) return;
            const dx = x - cube.x;
            const dy = y - cube.y;
            const dz = z - cube.z;

            if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) === 1) exposedFaces--;
        });

        return exposedFaces;
    });
}

function findAirPockets(cubes: Cube[], exposedFaces: number[]): Cube[] {
    const pockets = new Set<string>();
    const occupied = new Set<string>(cubes.map(c => stringify(c)));

    // console.log(cubes);

    let index = 0;
    for (const cube of cubes) {
        if (exposedFaces[index++] === 0) continue;

        const targets = [ top, bot, left, right, front, back ];

        for (const fn of targets) {
            const target = fn(cube);
            if (pockets.has(stringify(target)) || occupied.has(stringify(target))) continue;

            let surrounding = 0;

            for (const fn of targets) {
                const neighbor = fn(target);
                if (!occupied.has(stringify(neighbor))) break;
                surrounding++;
            }
            
            
            if (surrounding === 6) {
                pockets.add(stringify(target));
            }
        }
    }

    return [ ...pockets.keys() ].map(pointString => {
        const [ x, y, z ] = pointString.split(',').map(n => parseInt(n));
        return { x, y, z };
    });
}

const cubes = getCubes();
const totalExposedFaces = getExposedFaces(cubes);
const pockets = findAirPockets(cubes, totalExposedFaces);

console.log(pockets.length);

const exteriorExposedFaces = getExposedFaces([ ...cubes, ...pockets ]);

console.log("Puzzle 1", sum(totalExposedFaces));
// 4010 is too high
console.log("Puzzle 2", sum(exteriorExposedFaces));