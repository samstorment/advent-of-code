import { getTrimmedLines } from "../ts-utils/util.ts";

export const lines = await getTrimmedLines('./input.txt');

export const moves = ['ROCK', 'PAPER', 'SCISSOR'] as const;

export type RPS = typeof moves[number];
export type MyPick = 'X' | 'Y' | 'Z';
export type OppPick = 'A' | 'B' | 'C';

export const OPP = {
    A: 'ROCK',
    B: 'PAPER',
    C: 'SCISSOR'
}

export const VALUES = {
    ROCK: 1,
    PAPER: 2,
    SCISSOR: 3
}
