<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { Modal, Progress } from "@skeletonlabs/skeleton-svelte";
    import { Board as LogicBoard } from "$lib/types/Board";
    import { main_board } from "$lib/stores/main_board.svelte";
    import { openModal } from "$lib/stores/modals.svelte";
    import Board from "$lib/Components/Board/Board.svelte";
    import ProgressHex from "$lib/Components/UI/ProgressHex.svelte";
    import RegenerateButton from "$lib/Components/UI/RegenerateButton.svelte";
    import { settings } from "$lib/stores/settings.svelte";
    import MagnifyingGlass from "$lib/Components/UI/MagnifyingGlass.svelte";
    import Flag from "$lib/Components/UI/Flag.svelte";
    import Modals from "$lib/Components/Modals/Modals.svelte";

    $main_board = new LogicBoard(0, 0, true, true, 0);
    setTimeout(() => {
        $main_board = new LogicBoard(10, 10, true, true, 0)
    }, 1000);
</script>

<Modals></Modals>

<section
    class="btn-group preset-outlined-surface-50-950 rounded fixed right-0 m-5 z-20"
>
    <button class="btn preset-filled" onclick={() => openModal("settings")}> Opciones </button>
    <button class="btn" onclick={() => openModal("controls")}> Cómo jugar </button>
</section>

{#if $main_board.size == 0}
    <div class="w-1/2 left-1/4 top-10 z-50 fixed my-auto">
        <Progress />
    </div>
{:else}
    <main transition:fade class="z-10 relative h-full w-full">
        <Board board={$main_board} />
    </main>
    <var
        in:fly|global={{ y: -10 }}
        out:fly|global={{ y: -10 }}
        class="flex fixed top-0 left-0 rounded m-5 justify-between z-50 not-italic"
    >
        <ProgressHex progress={$main_board.flags} total={$main_board.mines} />
    </var>
    {#if $main_board.correctFlags == $main_board.mines && $main_board.flags <= $main_board.mines}
        <section
            transition:fade|global={{ duration: 500 }}
            class="left-0 right-0 bottom-1/4 w-fit mx-auto select-none justify-center z-20 fixed"
        >
            <div class="card p-2 z-20">
                <h1 class="h1 text-center mt-3 mb-5">¡Victoria!</h1>
                <RegenerateButton
                    size={$main_board.size}
                    mines={$main_board.mines}
                    cls="m-1 btn preset-filled rounded mt-1 w-fit"
                />
                <button
                    class="m-1 btn variant-filled-tertiary rounded mt-1 w-fit"
                    onclick={() => openModal("settings")}
                >
                    Configurar tablero
                </button>
            </div>
        </section>
    {/if}
    {#if settings.touchscreen}
        <div
            transition:fly|global
            class="fixed mx-auto rounded-full card bg-slate-500 left-0 right-0 bottom-0 mb-20 flex justify-between h-12 w-fit"
        >
            <div
                class="absolute m-2 h-8 rounded transition-all -z-50
                    ease-in-out duration-300 opacity-10 bg-white
                    {settings.flag ? 'rounded-e-full' : 'rounded-s-full'}
                "
                style="transform: translateX({settings.flag
                    ? 4.5
                    : 0}rem); width: 4.4rem;"
            ></div>
            <button
                onclick={() => (settings.flag = false)}
                class="text-3xlg rounded-s-full rounded-e p-0 mr-0 m-4 w-16"
                style="font-size: 3rem;"
            >
                <!-- Magnifying glass -->
                <MagnifyingGlass />
            </button>
            <button
                onclick={() => (settings.flag = true)}
                class="rounded-e-full rounded-s ml-0 p-0 m-4 w-16"
                style="font-size: 3rem;"
            >
                <Flag />
            </button>
        </div>
    {/if}
{/if}

<Modal />
