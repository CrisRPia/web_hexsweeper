<script lang="ts">
    import { fade } from "svelte/transition";
    import Cell from "./Cell.svelte";
    import Panzoom from "@panzoom/panzoom";
    import type { PanzoomObject } from "@panzoom/panzoom";
    import { Board } from "$lib/types/Board";

    let wrapper: HTMLDivElement;

    export let board: Board;
    export let moveable = true;
    export let width = 40;

    let panzoomElement;
    let panzoom: PanzoomObject;

    function initPanzoom(node: HTMLElement) {
        if (!moveable) {
            return;
        }
        panzoomElement = node;
        panzoom = Panzoom(panzoomElement, {
            maxScale: 5,
            minScale: 0.5,
            animate: true,
            roundPixels: false
        });

        setTimeout(() =>
            panzoom.pan(
                (wrapper.clientWidth - node.clientWidth) / 2,
                (wrapper.clientHeight - node.clientHeight) / 2,
                {
                    animate: false
                }
            )
        );
    }
</script>

<div
    on:wheel={panzoom.zoomWithWheel}
    bind:this={wrapper}
    class="
        {moveable
        ? 'overflow-hidden fixed left-1/2 top-1/2 -translate-y-1/2 -z-1'
        : 'pl-5 pt-7 -mb-3 w-fit'}
    "
    style={moveable
        ? "width: 100vw; height: 100vh; left: 0px; position:absolute"
        : undefined}
>
    <div use:initPanzoom id="mover" class="w-fit h-fit">
        <div
            class="relative overflow-visible whitespace-nowrap transition-transform w-fit h-fit"
        >
            {#each board.cells as row, x}
                <div
                    on:contextmenu={(e) => {
                        e.preventDefault();
                    }}
                    style="
                        line-height: 0;
                        vertical-align: top;
                        transform: translateX({x % 2 == 0
                        ? (-50 / board.size).toString()
                        : '0'}%);
                    "
                >
                    {#each row as _, y}
                        {#if x < board.size && y < board.size}
                            <div in:fade class="inline-block">
                                <Cell {x} {y} {width} {board} />
                            </div>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>
