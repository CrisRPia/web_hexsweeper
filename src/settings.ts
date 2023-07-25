import { writable } from "svelte/store";
let touchscreenVal = false;
let flagVal = false;
export const touchscreen = writable(touchscreenVal);
export const flag = writable(flagVal);
