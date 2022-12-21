// deno run --allow-read .\main.ts
import { getTrimmedLines, sum } from '../ts-utils/util.ts';

const lines = await getTrimmedLines('./input.txt');

function sums() {
    return lines.map(l => {
        const half1 = [...l].splice(0, l.length / 2);
        const half2 = [...l].splice(l.length / 2);
        
        let dup = '';
        
        half1.forEach(c => { 
            if (half2.includes(c)) return dup = c;
        });
        
        // return [ half1, half2 ];
        
        return getCharValue(dup);
    });
}

function getCharValue(char: string): number {
    const 
        a = 'a'.charCodeAt(0),
        z = 'z'.charCodeAt(0),
        A = 'A'.charCodeAt(0),
        Z = 'Z'.charCodeAt(0),
        c = char.charCodeAt(0);

    // if our character is lowercase, return it's value minus lowercase a and offset 1
    if (c >= a && c <= z) return c - a + 1;

    // if our character is upper case, return it's value minus uppercase A and offset 1 + the value of lowercase z
    if (c >= A && c <= Z) return c - A + 1 + getCharValue('z');

    // if the character wasn't an english alphabet character
    return -1;
}

console.log("Puzzle 1:", sum(sums()));



function getGroups() {
    let group: string[] = [];
    const groups: string[][] = [];
    let count = 0;

    for (const line of lines) {
        group.push(line);

        if (++count % 3 === 0) {
            groups.push(group);
            group = [];
        }
    }

    return groups;
}


function getGroupSums() {
    const groups = getGroups();

    return groups.map(g => {
        const sack1 = [...g[0]];
        const sack2 = [...g[1]];
        const sack3 = [...g[2]];

        let dup = '';

        sack1.forEach(c => { 
            if (sack2.includes(c) && sack3.includes(c)) return dup = c;
        });

        return getCharValue(dup);
    });
}

console.log("Puzzle 2:", sum(getGroupSums()));