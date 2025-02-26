<script lang="ts">
    import { preventDefault } from 'svelte/legacy';

    import { LogicCell } from "$lib/types/LogicCell";
    import { settings } from "$lib/stores/settings";
    import { Board } from "$lib/types/Board";

    let logic: LogicCell = $state();
    interface Props {
        width?: number;
        x: number;
        y: number;
        board: Board;
    }

    let {
        width = 30,
        x,
        y,
        board
    }: Props = $props();

    board.subscribe(() => {
        logic = board.cells[x][y];
    });

    function discover() {
        if (logic.discovered) {
            board.expand(x, y);
            return;
        }
        if (!logic.flagged) {
            board.discover_animate(x, y);
        }
    }

    function flagCell(e: MouseEvent) {
        e.preventDefault();
        board.flag(x, y);
    }

    function handleUp(e: MouseEvent) {
        if ($settings.flag) {
            flagCell(e);
        } else {
            discover();
        }
    }
    function handleKey(e: KeyboardEvent) {
        if (e.key === "Enter") {
            discover();
        }
    }
</script>

<div
    class="rotate-[120deg] overflow-hidden hexagon inline-block"
    style="--width: {width}px"
>
    <div class="w-full h-full overflow-hidden -rotate-[60deg]">
        <div
            tabindex={x * 10 + y + 20}
            role="button"
            onmouseup={handleUp}
            onkeypress={handleKey}
            oncontextmenu={flagCell}
            onfocus={preventDefault(() => board.hoverIn(x, y))}
            onblur={preventDefault(() => board.hoverOut(x, y))}
            onmouseover={() => board.hoverIn(x, y)}
            onmouseout={() => board.hoverOut(x, y)}
            class="
                duration-150
                ease-in
                w-full
                h-full
                -rotate-[60deg]
                {logic.forbidden
                ? 'bg-opacity-0'
                : logic.flagged
                ? 'bg-success-400 dark:bg-success-500'
                : logic.mined && logic.discovered
                ? 'bg-warning-500 dark:bg-error-500'
                : logic.discovered
                ? 'bg-tertiary-400 bg-opacity-30'
                : 'bg-tertiary-400 bg-opacity-100'}
                w-8
                inline-block
                transition-colors
                select-none
                hover:brightness-110
                hover:dark:brightness-105
                {logic.highlighted ? 'brightness-110 dark:brightness-150' : ''}
            "
        >
            {#if logic.discovered && !logic.mined && logic.value != 0}
                <p
                    class="
                        duation-150
                        ease-in
                        absolute
                        top-1/2
                        left-1/2
                        font-mono
                        -translate-x-1/2
                        -translate-y-1/2
                        {logic.forbidden ? 'blur' : ''}
                    "
                >
                    {logic.value}
                </p>
            {/if}
        </div>
    </div>
</div>

<style>
    .hexagon {
        --width: 40px;
        --base_margin: calc(var(--width) * -1.1);
        width: var(--width);
        height: calc(var(--width) * 2);
        margin: calc(var(--base_margin) + 1px) 0 0 calc(var(--width) * 0.05);
    }
</style>
