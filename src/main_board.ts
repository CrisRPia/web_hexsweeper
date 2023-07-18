import { Board } from "./types/Board";
import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

let board = new Board(0, 0);
export const main_board: Writable<Board> = writable(board);

