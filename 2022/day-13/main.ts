// deno run -A main.ts

import { sum, zip } from "../ts-utils/util.ts";

type PacketValue = number | Packet;

type Packet = Array<PacketValue>;

type PacketPair = [ left: Packet, right: Packet ];

const input = (await Deno.readTextFile('./input.txt')).replaceAll('\r', '').split('\n\n');


const pairs = input.map(text => {
    const [ p1, p2 ] = text.split('\n').map(arrayString => eval(arrayString));
    return [ p1, p2 ] as PacketPair;
})

function puzzle1() {
    const results = pairs.map(pair => compare(...pair));
    // if t < 0, the comparison was in the correct order, so return the array index + 1
    const sumOfIndexes = sum(results.map((t, i) => t < 0 ? i + 1 : 0));
    console.log("Puzzle 1:", sumOfIndexes);
}

function puzzle2() {
    const singleItems: Packet = [];

    singleItems.push([[2]]);
    singleItems.push([[6]]);

    pairs.forEach(([p1, p2]) => {
        singleItems.push(p1);
        singleItems.push(p2);
    });

    const sorted = singleItems.sort(compare);

    let i1 = 0;
    let i2 = 0;

    // start at 1 since that's the output the question asks for
    let index = 1;
    for (const item of sorted as Array<Packet>) {

        const isDividerPacket = (n: number) => (
            item.length === 1 && typeof item[0] === "object" && item[0].length === 1 && item[0][0] === n
        )

        if (isDividerPacket(2)) i1 = index;
        if (isDividerPacket(6)) { i2 = index; break; }
        
        index++;
    }

    console.log("Puzzle 2:", i1 * i2);
}

function compare(l: PacketValue, r: PacketValue): number {

    if (typeof l === "number") {
        if (typeof r === "number") return l - r;
        else if (typeof r === "object") return compare([l], r);
    }
    else if (typeof r === "number") {
        return compare(l, [r]);
    }

    l = l as Packet;
    r = r as Packet;

    // zip the lists together
    for (const [a, b] of zip(l, r)) {
        const result = compare(a, b);
        if (result !== 0) return result;
    }
    
    // if the loop above didn't find a return value
    return l.length - r.length;
}


puzzle1();
puzzle2();