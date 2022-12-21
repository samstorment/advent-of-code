// deno run --allow-read .\puzzle1.ts

import { lines, VALUES, OPP, OppPick, MyPick, RPS } from "./shared.ts";

const ME = {
    X: 'ROCK',
    Y: 'PAPER',
    Z: 'SCISSOR'
}

function getRoundResult(oppPick: OppPick, myPick: MyPick) {

    const oppType = OPP[oppPick] as RPS;
    const myType = ME[myPick] as RPS;

    let oppValue = VALUES[oppType];
    let myValue = VALUES[myType];

    const result = didWin(oppType, myType);
    
    if (result < 0) myValue += 6;
    else if (result > 0) oppValue += 6;
    else {
        myValue += 3;
        oppValue += 3;
    }

    return [ oppValue, myValue ];
}

// return positive if a wins, 0 if tie, negative if b wins
function didWin(a: RPS, b: RPS) {
    if (a === 'ROCK' && b === 'SCISSOR') return 1;
    if (a === 'PAPER' && b === 'ROCK') return 1;
    if (a === 'SCISSOR' && b === 'PAPER') return 1;
    if (a === b) return 0;
    return -1;
}


const results = lines.map(l => {
    const [ opp, me ] = l.split(" ");
    return getRoundResult(opp as OppPick, me as MyPick);
});


const myTotal = results.map(r => r[1])
    .reduce((sum, curr) => sum + curr, 0);


console.log("Puzzle 1:", myTotal);

