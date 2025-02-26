<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { Modal, ProgressBar } from "@skeletonlabs/skeleton";
    import { Board as LogicBoard } from "$lib/types/Board";
    import { main_board } from "$lib/stores/main_board";
    import { openModal } from "$lib/stores/modals";
    import Board from "$lib/Components/Board/Board.svelte";
    import ProgressHex from "$lib/Components/UI/ProgressHex.svelte";
    import RegenerateButton from "$lib/Components/UI/RegenerateButton.svelte";
    import { settings } from "$lib/stores/settings";
    import MagnifyingGlass from "$lib/Components/UI/MagnifyingGlass.svelte";
    import Flag from "$lib/Components/UI/Flag.svelte";

    let board: LogicBoard;
    main_board.subscribe(() => {
        board = $main_board;
    });

    async function sleep(ms: number) {
        return await new Promise((resolve) => setTimeout(resolve, ms));
    }
    async function init() {
        main_board.set(new LogicBoard(0, 0, true, true, 0));
        // This is done to hide ugly initial rendering of panzoom
        await sleep(100);
        main_board.set(new LogicBoard(10, 10, true, true, 0));
    }
    init();
</script>

<div class="btn-group-vertical variant-glass rounded fixed right-0 m-5 z-10">
    <button on:click={() => openModal("settings")}> Opciones </button>
    <button on:click={() => openModal("controls")}> Cómo jugar </button>
</div>

{#if board.size == 0}
    <div class="w-1/2 left-1/4 top-10 z-50 fixed my-auto">
        <ProgressBar />
    </div>
{:else}
    <div transition:fade|global>
        <Board board={$board} />
    </div>
    <div
        in:fly|global={{ y: -10 }}
        out:fly|global={{ y: -10 }}
        class="flex fixed rounded m-5 justify-between z-50"
    >
        <ProgressHex progress={$board.flags} total={$board.mines} />
    </div>
    {#if $board.correctFlags == $board.mines && $board.flags <= $board.mines}
        <div
            transition:fade|global={{ duration: 500 }}
            class="left-0 right-0 bottom-1/4 w-fit mx-auto select-none justify-center z-20 fixed"
        >
            <div class="card p-2 z-20">
                <h1 class="h1 text-center mt-3 mb-5">¡Victoria!</h1>
                <RegenerateButton
                    size={$board.size}
                    mines={$board.mines}
                    cls="m-1 btn variant-filled-primary rounded mt-1 w-fit"
                />
                <button
                    class="m-1 btn variant-filled-tertiary rounded mt-1 w-fit"
                    on:click={() => openModal("settings")}
                >
                    Configurar tablero
                </button>
            </div>
        </div>
    {/if}
    {#if $settings.touchscreen}
        <div
            transition:fly|global
            class="fixed mx-auto rounded-full card bg-slate-500 left-0 right-0 bottom-0 mb-20 flex justify-between h-12 w-fit"
        >
            <div
                class="absolute m-2 h-8 rounded transition-all -z-50
                    ease-in-out duration-300 opacity-10 bg-white
                    {$settings.flag ? 'rounded-e-full' : 'rounded-s-full'}
                "
                style="transform: translateX({$settings.flag
                    ? 4.5
                    : 0}rem); width: 4.4rem;"
            />
            <button
                on:click={() => ($settings.flag = false)}
                class="text-3xlg rounded-s-full rounded-e p-0 mr-0 m-4 w-16"
                style="font-size: 3rem;"
            >
                <!-- Magnifying glass -->
                <MagnifyingGlass />
            </button>
            <button
                on:click={() => ($settings.flag = true)}
                class="rounded-e-full rounded-s ml-0 p-0 m-4 w-16"
                style="font-size: 3rem;"
            >
                <Flag />
            </button>
        </div>
    {/if}
{/if}

<Modal />
