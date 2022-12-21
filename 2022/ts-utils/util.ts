// deno run -A ./util.ts
import { config } from "https://deno.land/std@0.167.0/dotenv/mod.ts";
import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
const env = await config({ path: '../.env' });

const year = 2022;

export type Point = {
    x: number;
    y: number;
}

export const up    = (p: Point): Point => ({ ...p, y: p.y - 1 });
export const down  = (p: Point): Point => ({ ...p, y: p.y + 1 });
export const left  = (p: Point): Point => ({ ...p, x: p.x - 1 });
export const right = (p: Point): Point => ({ ...p, x: p.x + 1 });

export type Grid<T> = T[][];

export async function getTrimmedLines(filePath: string): Promise<string[]> {

    const lines: string[] = [];

    const fileReader = await Deno.open(filePath);

    for await (const line of readLines(fileReader)) {
        lines.push(line.trim());
    }

    return lines;
}


export async function getInput(day: number): Promise<Array<string>> {

    try {
        await Deno.open(`./input.txt`);
        const text = await Deno.readTextFile("./people.json");
        return text.trim().split("\n");
        // return getTrimmedLines('./input.txt');
    } catch {
        const res = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
            method: 'GET',
            headers: {
                "Cookie": `session=${env["SESSION"]}`,
                "User-Agent": "Sam Storment https://github.com/samstorment"
            }
        });
    
        const text = (await res.text());
        
        Deno.writeTextFile('./input.txt', text);

        return text.trim().split('\n');
    }
}


export function zip<T, U>(arr1: T[], arr2: U[]) {
    const arr = arr1.length > arr2.length ? arr2 : arr1;

    return arr.map((_, i) => {
        return [ arr1[i], arr2[i] ];
    });
}

export function sum(nums: number[]): number {
    return nums.reduce((total, current) => total + current, 0);
}


export function snapshot<T>(a: Point, b: Point, grid: Grid<T>) {
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


export function draw<T>(grid: Grid<T>) {
    for (let i = 0; i < grid.length; i++) {
        let str = '';
        for (let j = 0; j < grid[0].length; j++) {
            str += grid[i][j];
        }
        console.log(str);
    }
}