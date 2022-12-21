import { down, getInput, getTrimmedLines, left, Point, right } from '../ts-utils/util.ts';


const [ input ] = await getInput(17);
// const [ input ] = await getTrimmedLines('./input-test.txt');

type Line = Point[];

enum RockTypes {
    Dash=0, Cross, L, I, Square
}

const NUM_TYPES = 5;

const stringify = (p: Point) => `${p.x},${p.y}`; 

function fall(numRocks: number) {
    const points = new Set<string>();
    
    let top = 0;
    let rockCount = 0;
    let iteration = 0;

    while (rockCount < numRocks) {

        // console.log("TOP", top);

        const shape = createShape(rockCount % NUM_TYPES, top);
        let fall = false;

        // console.log("SHAPE", shape.points);

        while (true) {
            if (!fall) {
                const instruction = input[iteration % input.length];
                // console.log(instruction);
                if (instruction === ">") shape.right(points);
                else shape.left(points);
                iteration++;
            } else if (!shape.down(points)) {
                top = Math.min(top, ...shape.points.map(p => p.y - 1));
                addPointsToSet(shape.points, points);
                // console.log(shape.points);
                break;
            }

            fall = !fall;
        }

        rockCount++;
    }

    return Math.abs(top);
}

function pointInSet(p: Point, set: Set<string>) {
    return set.has(stringify(p));
}

function addPointsToSet(points: Line, set: Set<string>) {
    points.forEach(p => set.add(stringify(p)));
}

abstract class Shape {

    minX = 0;
    maxX = 6;
    points: Line = [];

    abstract rightPoints(): Line;
    abstract leftPoints(): Line;
    abstract downPoints(): Line;
    
    left(set: Set<string>) {
        for (const p of this.leftPoints()) {
            if (p.x === this.minX) return;
            if (pointInSet(left(p), set)) return;
        }
        this.movePoints(left);
    }

    right(set: Set<string>) {
        for (const p of this.rightPoints()) {
            if (p.x === this.maxX) return;
            if (pointInSet(right(p), set)) return;
        }
        this.movePoints(right);
    }

    down(set: Set<string>) {
        for (const p of this.downPoints()) {
            if (p.y === 0) return false;
            if (pointInSet(down(p), set)) return false;
        }

        this.movePoints(down);
        return true;
    }

    movePoints(cb: (p: Point) => Point) {
        this.points = this.points.map(cb);
    }
}

class Dash extends Shape {
    constructor(y: number) {
        super();
        for (let x = 2; x <= 5; x++) {
            this.points.push({ x, y: y - 3 });
        }
    }

    leftPoints(): Line { return [ this.points[0] ]; }
    rightPoints(): Line { return [ this.points[this.points.length - 1] ]; }
    downPoints(): Line { return this.points; }
}

class Cross extends Shape {
    constructor(y: number) {
        super();
        this.points.push(
            { x: 2, y: y - 4},
            { x: 3, y: y - 3},
            { x: 4, y: y - 4},
            { x: 3, y: y - 4},
            { x: 3, y: y - 5},
        )
    }

    leftPoints(): Line {
        return [ this.points[4], this.points[0], this.points[1] ];
    }

    rightPoints(): Line {
        return [ this.points[4], this.points[2], this.points[1] ];
    }

    downPoints(): Line {
        return [ this.points[0], this.points[1], this.points[2] ];
    }
}

class L extends Shape {
    constructor(y: number) {
        super();
        this.points.push(
            { x: 2, y: y - 3},
            { x: 3, y: y - 3},
            { x: 4, y: y - 3},
            { x: 4, y: y - 4},
            { x: 4, y: y - 5},
        )
    }

    leftPoints(): Line {
        return [ this.points[0] ];
    }

    rightPoints(): Line {
        return [ this.points[2], this.points[3], this.points[4] ];
    }

    downPoints(): Line {
        return [ this.points[0], this.points[1], this.points[2] ];
    }
}

class I extends Shape {
    constructor(y: number) {
        super();
        this.points.push(
            { x: 2, y: y - 3},
            { x: 2, y: y - 4},
            { x: 2, y: y - 5},
            { x: 2, y: y - 6},
        )
    }

    leftPoints(): Line {
        return this.points;
    }

    rightPoints(): Line {
        return this.points;
    }

    downPoints(): Line {
        return [ this.points[0] ];
    }
}

class Square extends Shape {
    constructor(y: number) {
        super();
        this.points.push(
            { x: 2, y: y - 3},
            { x: 2, y: y - 4},
            { x: 3, y: y - 3},
            { x: 3, y: y - 4},
        )
    }

    leftPoints(): Line {
        return [ this.points[0], this.points[1] ];
    }

    rightPoints(): Line {
        return [ this.points[2], this.points[3] ];

    }

    downPoints(): Line {
        return [ this.points[0], this.points[2] ];
    }
}


function createShape(rockType: RockTypes, y: number) {
    switch (rockType) {
        case RockTypes.Dash: return new Dash(y);
        case RockTypes.Cross: return new Cross(y);
        case RockTypes.L: return new L(y);
        case RockTypes.I: return new I(y);
        case RockTypes.Square: return new Square(y);
    }
}

// 4448 too high
// const top = fall(1000_000_000_000);
const top = fall(2022);

console.log("Puzzle 1:", top);