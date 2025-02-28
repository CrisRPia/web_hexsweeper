<script lang="ts">
    import { fade } from "svelte/transition";
    import Cell from "./Cell.svelte";
    import Panzoom, { type PanzoomOptions } from "@panzoom/panzoom";
    import { Board } from "$lib/types/Board";

    let wrapper: HTMLDivElement | undefined = $state();

    interface Props {
        board: Board;
        moveable?: boolean;
        width?: number;
    }

    let { board, moveable = true, width = 40 }: Props = $props();

    let panzoomElement: HTMLDivElement | undefined = $state();
    let panzoom = $derived.by(() => {
        if (
            wrapper === undefined ||
            !moveable ||
            panzoomElement === undefined
        ) {
            return undefined;
        }

        console.log("HI");

        const x = (wrapper.clientWidth - panzoomElement.clientWidth) / 2;
        const y = (wrapper.clientHeight - panzoomElement.clientHeight) / 2;

        const panzoom = Panzoom(panzoomElement, {
            maxScale: 5,
            minScale: 0.5,
            animate: true,
            startX: x,
            startY: y,
            roundPixels: false
        } satisfies PanzoomOptions);

        setTimeout(() => {
            panzoom.pan(x, y, {
                duration: 500
            });
        })

        return panzoom;
    });

    $inspect(panzoom);
</script>

<div
    onwheel={panzoom?.zoomWithWheel}
    bind:this={wrapper}
    bind:this={panzoomElement}
    class="
        {moveable
        ? 'overflow-hidden absolute left-1/2 top-1/2 -translate-y-1/2 -z-1'
        : 'pl-5 pt-7 -mb-3 w-fit'}
    "
    style={moveable
        ? "width: 100vw; height: 100vh; left: 0px; position:absolute"
        : undefined}
>
    <div bind:this={panzoomElement} id="mover" class="w-fit h-fit">
        <div
            class="relative overflow-visible whitespace-nowrap transition-transform w-fit h-fit"
        >
            {#each board.cells as row, x}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    oncontextmenu={(e) => {
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
                            <div in:fade|global class="inline-block">
                                <Cell {x} {y} {width} {board} />
                            </div>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>
