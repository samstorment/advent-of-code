// run with `deno run --allow-read .\main.ts`

import { getInput } from "../ts-utils/util.ts";

const lines = await getInput(1);

let sum = 0;
let i = 0;

const sums: number[] = [];

for (const line of lines) {
    if (line === '' || i === lines.length - 1) {
        sums.push(sum);
        sum = 0;
    } else {
        sum += parseInt(line);
    }
    i++;
}


// answer to puzzle 1
console.log("Puzzle 1:", Math.max(...sums));


const [ one, two, three ] = sums.sort((a, b) => a < b ? 1 : -1);

// answer to puzzle 2
console.log("Puzzle 2:", one + two + three);