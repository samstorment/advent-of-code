import { getInput } from '../ts-utils/util.ts';

const lines = (await getInput(8)).map(c => c.split('').map(c => parseInt(c)));

const vis = lines.map((l, i) => l.map((_, j) => visible(i, j)))
console.log("Puzzle 1:", vis.flat().filter(t => t).length);

const scores = lines.map((l, i) => l.map((_, j) => score(i, j)));
console.log("Puzzle 2:", Math.max(...scores.flat()));


function visibleLeft(row: number, col: number): boolean {
    const me = lines[row][col];
    return col === 0 || (scoreLeft(row, col) == col && me > lines[row][0]);
}

function visibleRight(row: number, col: number): boolean {
    const me = lines[row][col];
    const end = lines[row].length - 1;
    return col === end || (scoreRight(row, col) == end - col && me > lines[row][end]);
}


function visibleTop(row: number, col: number): boolean {
    const me = lines[row][col];
    return row === 0 || (scoreTop(row, col) === row && me > lines[0][col]);
}

function visibleBot(row: number, col: number): boolean {
    const me = lines[row][col];
    const end = lines.length - 1;
    return row === end || (scoreBot(row, col) === end - row && me > lines[end][col]);
}


function visible(row: number, col: number) {
    return visibleLeft(row, col) || visibleRight(row, col) || visibleTop(row, col) || visibleBot(row, col);
}

function scoreLeft(row: number, col: number): number {

    const line = lines[row];
    const me = lines[row][col];

    let score = 0;

    for (let i = col - 1; i >= 0; i--) {
        score++;
        if (line[i] >= me) break;
    }

    return score;
}

function scoreRight(row: number, col: number): number {

    const line = lines[row];
    const me = lines[row][col];

    let score = 0;

    for (let i = col + 1; i < line.length; i++) {
        score++;
        if (line[i] >= me) break;
    }

    return score;
}


function scoreTop(row: number, col: number): number {

    const me = lines[row][col];

    let score = 0;

    for (let i = row - 1; i >= 0; i--) {
        score++;
        if (lines[i][col] >= me) break;
    }

    return score;
}

function scoreBot(row: number, col: number): number {

    const me = lines[row][col];

    let score = 0;

    for (let i = row + 1; i < lines.length; i++) {
        score++;
        if (lines[i][col] >= me) break;
    }

    return score;
}


function score(row: number, col: number) {
    return scoreLeft(row, col) * scoreRight(row, col) * scoreTop(row, col) * scoreBot(row, col);
}