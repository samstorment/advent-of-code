// deno run --allow-read .\main.ts
import { getInput, sum } from '../ts-utils/util.ts';
import { Dir } from './models.ts';

const lines = await getInput(7);
// const lines = await getTrimmedLines('./input.txt');

const TOTAL_SIZE = 70_000_000;
const SPACE_NEEDED = 30_000_000;

const home = new Dir("/");
let wd = home;

lines.forEach((l) => {
    const args = l.split(' ');

    if (l.startsWith("$ cd")) {
        const path = args[args.length - 1];
        if (path === '/') wd = home;
        else wd = wd.cd(path);
    } 

    if (!l.startsWith("$")) {
        const name = args[1];

        if (l.startsWith("dir")) {
            wd.mkdir(name);
        } else {
            const size = parseInt(args[0]);
            wd.touch(name, size);
        }
    }
});


function puzzle1() {
    const dirs = home
        .filter(dir => dir.getSize() <= 100_000)
        .map(d => d.getSize());

    console.log("Puzzle 1:", sum(dirs));
}


function puzzle2() {
    const unusedSpace = TOTAL_SIZE - home.getSize();
    const amountToDelete = SPACE_NEEDED - unusedSpace;

    // sort directories by ascending size
    const dirs = home
        .filter(dir => dir.getSize() >= amountToDelete)
        .sort((a, b) => a.getSize() - b.getSize());


    console.log("Puzzle 2:", dirs[0].getSize());
}

puzzle1();
puzzle2();