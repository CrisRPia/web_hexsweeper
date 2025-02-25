import { Board } from "$lib/types/Board";
import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const main_board: Writable<Board> = writable(new Board(0, 0));
