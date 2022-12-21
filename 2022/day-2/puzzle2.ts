import { lines, VALUES, OPP, OppPick, MyPick, RPS, moves } from "./shared.ts";

const OUTCOME = {
    X: -1,
    Y: 0,
    Z: 1
}

function getRoundResult(oppPick: OppPick, myPick: MyPick) {

    const oppType = OPP[oppPick] as RPS;
    const myType = getType(oppType, myPick) as RPS;

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


function getType(oppType: RPS, myPick: MyPick) {
    const desiredOutcome = OUTCOME[myPick];

    // we can guarantee the if statement will always be reached
    for (const m of moves) {
        const move = m as RPS;
        if (didWin(move, oppType) === desiredOutcome) return move;
    }

}


const results = lines.map(l => {
    const [ opp, me ] = l.split(" ");
    return getRoundResult(opp as OppPick, me as MyPick);
});

const myTotal = results.map(r => r[1])
    .reduce((sum, curr) => sum + curr, 0);


console.log("Puzzle 2:", myTotal);