import { Board } from "$lib/types/Board";
import { writable } from "svelte/store";

export const main_board = writable(new Board(0, 0));
