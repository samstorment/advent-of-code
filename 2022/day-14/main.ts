// deno run -A .\main.ts
import { getInput } from "../ts-utils/util.ts";

const input = (await getInput(14));

type Line = Point[];

type Point = {
    x: number;
    y: number;
}

type Grid = string[][];

function getRocks(offsetX = 0) {

    const rocks: Line[] = input.map(lineStr => {
        const pointStrings = lineStr.split(' -> ');
        return pointStrings.map(p => {
            const [ xStr, yStr ] = p.split(',');
            return { x: parseInt(xStr) + offsetX, y: parseInt(yStr) };
        });
    });

    return rocks;
}

// returns top left point and bottom right point of grid range containing rocks and our source of sand
function getDebrisRange(source: Point, rocks: Line[]) {

    const xCoords = rocks.flat().map(p => p.x).sort((a, b) => a - b)
    const yCoords = rocks.flat().map(p => p.y).sort((a, b) => a - b);
    
    const minX = Math.min(...xCoords, source.x);
    const maxX = Math.max(...xCoords, source.x);
    const minY = Math.min(...yCoords, source.y);
    const maxY = Math.max(...yCoords, source.y);
    
    const minPoint = { x: minX, y: minY };
    const maxPoint = { x: maxX, y: maxY };

    return [ minPoint, maxPoint ];
}

function createGrid(rowStop: number, colStop: number) {
    const grid: Grid = [];

    for (let i = 0; i <= rowStop; i++) {
        const row: string[] = [];
        for (let j = 0; j <= colStop; j++) {
            row.push('.');
        }
        grid.push(row);
    }

    return grid;
}


function drawLine(a: Point, b: Point, grid: Grid) {

    const min = a.x < b.x || a.y < b.y ? a : b;
    const max = a.x > b.x || a.y > b.y ? a : b;

    for (let i = min.y; i <= max.y; i++) {
        for (let j = min.x; j <= max.x; j++) {
            grid[i][j] = '#';
        }
    }
}

function snapshot<T>(a: Point, b: Point, grid: T[][]) {
    const result: T[][] = [];

    for (let i = a.y; i <= b.y; i++) {
        const row: T[] = [];
        for (let j = a.x; j <= b.x; j++) {
            row.push(grid[i][j]);
        }
        result.push(row);
    }

    return result;
}


function draw<T>(grid: T[][]) {
    for (let i = 0; i < grid.length; i++) {
        let str = '';
        for (let j = 0; j < grid[0].length; j++) {
            str += grid[i][j];
        }
        console.log(str);
    }
}


function drawDebris<T>(source: Point, rocks: Line[], grid: Grid) {
    grid[source.y][source.x] = "+";

    for (const rockLine of rocks) {
        let i = 0;
        for (const rock of rockLine) {
            if (++i === rockLine.length) break;
            const next = rockLine[i];
            drawLine(rock, next, grid);
        }
    }
}


const down  = (p: Point): Point => ({ ...p, y: p.y + 1 });
const left  = (p: Point): Point => ({ ...p, x: p.x - 1 });
const right = (p: Point): Point => ({ ...p, x: p.x + 1 });
const downLeft  = (p: Point) => left(down(p));
const downRight = (p: Point) => right(down(p));
const equal = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

function getPoint(point: Point, grid: Grid) {
    return grid[point.y][point.x];
}

function isInGrid(p: Point, grid: Grid) {
    return p.y >= 0 && p.x >= 0 && p.y < grid.length && p.x < grid[0].length;
}

function drawPoint(character: string, point: Point, grid: Grid) {
    grid[point.y][point.x] = character;
}

function dropSand(grid: Grid, point: Point): Point | null {

    if (!isInGrid(down(point), grid) && !isInGrid(downLeft(point), grid) && !isInGrid(downRight(point), grid)) return null;

    if (isInGrid(down(point), grid) && getPoint(down(point), grid) === '.') {
        return dropSand(grid, down(point));
    }

    if (isInGrid(downLeft(point), grid) && getPoint(downLeft(point), grid) === '.') {
        return dropSand(grid, downLeft(point));
    }

    if (isInGrid(downRight(point), grid) && getPoint(downRight(point), grid) === '.') {
        return dropSand(grid, downRight(point));
    }

    return point;
}

function countRestingSand(source: Point, grid: Grid) {
    
    let p = dropSand(grid, source);
    let count = 0;

    while (p && !equal(source, p)) {
        count++;
        drawPoint('o', p, grid);
        // draw(snapshot({ x: 495, y: 0}, { x: 543, y: 11 }, grid));
        p = dropSand(grid, source);
    }
    
    return count;
}

function puzzle1() {

    const source = { x: 500, y: 0 };

    const rocks = getRocks();
    const [ _, max ] = getDebrisRange(source, rocks);
    const grid = createGrid(max.y, max.x);
    
    drawDebris(source, rocks, grid);
        
    console.log("Puzzle 1:", countRestingSand(source, grid));
}


function puzzle2() {
    // amount to translate all drawing by. this makes it so our floor is  
    const translateX = 1000;

    const source = { x: 500 + translateX, y: 0 };
    const rocks = getRocks(translateX);

    
    const [ _, max ] = getDebrisRange(source, rocks); 

    // for the floor
    const maxY = max.y + 2;

    const grid = createGrid(maxY, max.x + translateX);
    
    drawDebris(source, rocks, grid);
    drawLine({ x: 0, y: maxY }, { x: max.x + translateX, y: maxY }, grid);

    // add 1 since the source ins't being counted
    console.log("Puzzle 2:", countRestingSand(source, grid) + 1);
}

puzzle1();
puzzle2();