<script lang="ts">
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import Settings from './Settings.svelte';
	import Board from './Board.svelte';
	import { main_board } from './main_board';
	import { Board as LogicBoard } from './types/Board';
	let board: LogicBoard;
	main_board.subscribe(() => {
		board = $main_board;
	});
    main_board.set(new LogicBoard(10, 10));

	const modalComponent: ModalComponent = {
		// Pass a reference to your custom component
		ref: Settings
	};
	const modal: ModalSettings = {
		type: 'component',
		// Pass the component directly:
		component: modalComponent
	};
</script>
<div class="flex justify-between">
    <div
        class="relative select-none rounded m-2 p-1 w-2/6 variant-glass font-mono z-10 break-all leading-none"
    >
        {#each { length: Math.max($board.mines, $board.flags) } as _, i}
            {#if i < $board.flags}
                <span class={i >= $board.mines ? 'text-red-500' : ''}> ⬢</span>
            {:else}
                <span>⬡</span>
            {/if}
        {/each}
    </div>
    <button
        on:click={() => modalStore.trigger(modal)}
        class="
            btn
            variant-glass
            fixed right-0 m-2 z-10
        "
    >
        ?
    </button>
</div>

<Board size={$board.size} />

<Modal />
