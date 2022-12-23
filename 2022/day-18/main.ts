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

function getExposedFaces(cubes: Cube[]) {
    return cubes.map((cube, index) => {
        let exposedFaces = 6;

        cubes.forEach(({x, y, z}, i) => {
            if (i === index) return;
            const dx = Math.abs(x - cube.x);
            const dy = Math.abs(y - cube.y);
            const dz = Math.abs(z - cube.z);

            if (dx + dy + dz === 1) exposedFaces--;
        });

        return exposedFaces;
    });
}

function findAirPockets(cubes: Cube[]) {

}

const cubes = getCubes();
const exposedFaces = getExposedFaces(cubes);

// console.log(exposedFaces);

console.log("Puzzle 1", sum(exposedFaces));