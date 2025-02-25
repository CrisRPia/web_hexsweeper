import { writable } from "svelte/store";

export const settings = writable({
    touchscreen: false,
    flag: false
});
