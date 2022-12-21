import { getInput, getTrimmedLines } from '../ts-utils/util.ts';


// const input = await getInput(16);
const input = await getTrimmedLines('./input.txt');

type Valve = {
    name: string,
    flowRate: number,
    neighbors: string[]
}

type Valves = Record<string, Valve>;

type Distances = Record<string, number>;

type Graph = Record<string, Distances>;

function getValves() {
    const valves: Valves = {};

    for (const line of input) {
        const [ h1, h2 ] = line.split('; ');
        const valve = h1.split(' ')[1];
        const rate = h1.split(' ')[4].split('=')[1];
        let [ _1, _2, _3, _4, ...neighbors ] = h2.split(' ');
        neighbors = neighbors.join('').split(',')
        
        valves[valve] = {
            name: valve,
            flowRate: parseInt(rate),
            neighbors
        }
    }

    return valves;
}

function bfs(start: string, valves: Valves) {

    const visited = new Set<string>();
    const distances: Distances = {};

    let q = [ start ];
    visited.add(start);
    distances[start] = 0;

    while (q.length > 0) {
        const [ current, ...rest ] = q;
        q = rest;
        const valve = valves[current];

        
        for (const name of valve.neighbors) {
            if (name === start) continue;
            if (visited.has(name)) continue;

            distances[name] = distances[current] + 1;
            q.push(name);
            visited.add(name);
        }
    }

    return distances;
}

function getCompleteGraph(valves: Valves) {

    const allDistances: Graph = {};

    for (const [key, value] of Object.entries(valves)) {
        if (value.flowRate === 0 && key !== "AA") {
            continue;
        }

        allDistances[key] = {};

        const distances = bfs(key, valves);

        for (const [k, v] of Object.entries(distances)) {
            if (valves[k].flowRate === 0 && k !== "AA") {
                continue;
            }

            if (k === key) continue;
            if (key !== 'AA' && k === 'AA') continue;

            allDistances[key][k] = v;
        }
    }

    return allDistances;
}


function dfs(src: string, time: number, opened: Set<string>, valves: Valves, graph: Graph): number {
    let maxFlow = 0;

    for (const [key, value] of Object.entries(graph[src])) {
        if (opened.has(key)) continue;

        const timeRemaining = time - value - 1;
        if (timeRemaining <= 0) continue;

        maxFlow = Math.max(
            maxFlow,
            dfs(key, timeRemaining, new Set([...opened.keys(), key]), valves, graph) + valves[key].flowRate * timeRemaining
        );
    }

    return maxFlow;
}

function* subsets<T>(array: T[], offset = 0): Generator<T[]> {
    while (offset < array.length) {

        const first = array[offset++];

        for (const subset of subsets(array, offset)) {
            subset.push(first);
            yield subset;
        }
    }

    yield [];
}

function difference<T>(setA: T[], setB: T[]) {
    const diff = new Set(setA);

    for (const elem of setB) {
        diff.delete(elem);
    }

    return diff;
}

const valves = getValves();
const graph = getCompleteGraph(valves);

function puzzle1() {
    // console.log(flowRate);
    const rate = dfs("AA", 30, new Set(), valves, graph);
    console.log("Puzzle 1:", rate);
}

function puzzle2() {
    const open = [...Object.keys(graph)];
    let max = 0;

    for (const set of subsets(open)) {
        const diff = difference(open, set);

        // console.log(diff);
        max = Math.max(
            max,
            dfs("AA", 26, new Set(set), valves, graph) + dfs("AA", 26, diff, valves, graph)
        );
    }

    console.log("Puzzle 2:", max)
}

// puzzle1();

// poorly optimized but correct - currently takes like 5 minutes
puzzle2();
