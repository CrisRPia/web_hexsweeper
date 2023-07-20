<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Modal, ProgressBar, ProgressRadial, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import Settings from './Settings.svelte';
	import Board from './Board.svelte';
	import { main_board } from './main_board';
	import { Board as LogicBoard } from './types/Board';
	import RegenerateButton from './RegenerateButton.svelte';
	let board: LogicBoard;
	main_board.subscribe(() => {
		board = $main_board;
	});
	main_board.set(new LogicBoard(10, 10, true, true, 0));

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

{#if board.size == 0}
	<div class="w-1/2 left-1/4 top-10 z-50 fixed my-auto">
		<ProgressBar />
	</div>
{:else}
	<div transition:fade>
		<Board size={$board.size} />
	</div>
	<div in:fly={{ y: -10 }} out:fly={{ y: -10 }} class="flex justify-between">
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
	</div>
	{#if $board.correctFlags == $board.mines}
		<div
			transition:fade={{ duration: 500 }}
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
					on:click={() => modalStore.trigger(modal)}
				>
					Configurar tablero
				</button>
			</div>
		</div>
	{/if}
{/if}

<Modal />
