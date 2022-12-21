import { getInput } from "../ts-utils/util.ts";

type Direction = 'L' | 'R' | 'U' | 'D';

class Point {
    x = 0;
    y = 0;

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString = () => `${this.x},${this.y}`;

    transX = (n: number) => this.x += n;
    transY = (n: number) => this.y += n;

    left  = (n: number) => this.transX(-n);
    right = (n: number) => this.transX(n);
    up    = (n: number) => this.transY(-n);
    down  = (n: number) => this.transY(n);

    move(direction: Direction, n: number) {
        switch (direction) {
            case 'L': return this.left(n);
            case 'R': return this.right(n);
            case 'U': return this.up(n);
            case 'D': return this.down(n);
        } 
    }

    getDistTo = (p: Point) => [ p.x - this.x,  p.y - this.y ];

    trailY(p: Point) {
        const [ dx, dy ] = this.getDistTo(p);

        if (Math.abs(dy) <= 1) return; 

        if (dy > 0) this.transY(dy - 1);
        else this.transY(dy + 1);

        if (dx > 0) this.transX(Math.max(dx - 1, 1));
        if (dx < 0) this.transX(Math.min(dx + 1, -1));
    } 

    trailX(p: Point) {
        const [ dx, dy ] = this.getDistTo(p);

        if (Math.abs(dx) <= 1) return;

        if (dx > 0) this.transX(dx - 1);
        else this.transX(dx + 1);
        
        if (dy > 0) this.transY(Math.max(dy - 1, 1));
        if (dy < 0) this.transY(Math.min(dy + 1, -1));
    } 

    trail(p: Point) {
        this.trailY(p);
        this.trailX(p);
    }
}

class Rope {
    size = 0;
    points: Array<Point> = [];

    constructor(size: number) {
        this.size = size;
        for (let i = 0; i < size; i++) {
            this.points.push(new Point());
        }
    }

    move(direction: Direction, n: number) {
        const [ head, ...rest ] = this.points;
        head.move(direction, n);
        rest.forEach((p, i) => p.trail(this.points[i]));
    }

    getHead = () => this.points[0];
    getTail = () => this.points[this.points.length - 1];
}

const lines = await getInput(9);

function solve(size: number) {
    const visited = new Set();

    const rope = new Rope(size);
    
    visited.add(rope.getTail().toString());

    for (const l of lines) {
        const args = l.split(' ');
        
        const direction = args[0] as Direction;
        const n = parseInt(args[1]);
                
        for (let i = 0; i < n; i++) {
            rope.move(direction, 1);
            visited.add(rope.getTail().toString());
        }
    }

    return visited.size;
}

console.log('Puzzle 1:', solve(2));
console.log('Puzzle 2:', solve(10));