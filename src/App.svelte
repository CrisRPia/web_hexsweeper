<script lang="ts">
	import { fade, fly } from 'svelte/transition';
    import MagnifyingGlass from './MagnifyingGlass.svelte';
    import Flag from "./Flag.svelte";
	import { Modal, ProgressBar, modalStore } from '@skeletonlabs/skeleton';
    import ProgressHex from './ProgressHex.svelte';
	import { touchscreen, flag } from './settings';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import Settings from './Settings.svelte';
	import Board from './Board.svelte';
	import { main_board } from './main_board';
	import { Board as LogicBoard } from './types/Board';
	import RegenerateButton from './RegenerateButton.svelte';
	import Controls from './Controls.svelte';
	let board: LogicBoard;
	main_board.subscribe(() => {
		board = $main_board;
	});

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	async function starter() {
		main_board.set(new LogicBoard(0, 0, true, true, 0));
		// This is done to hide ugly initial rendering of panzoom
		await sleep(100);
		main_board.set(new LogicBoard(10, 10, true, true, 0));
	}
	starter();

	const settingsComponent: ModalComponent = {
		// Pass a reference to your custom component
		ref: Settings
	};
	const controlsComponent: ModalComponent = {
		// Pass a reference to your custom component
		ref: Controls
	};
	const settingsModal: ModalSettings = {
		type: 'component',
		// Pass the component directly:
		component: settingsComponent
	};
	const controlsModal: ModalSettings = {
		type: 'component',
		// Pass the component directly:
		component: controlsComponent
	};
</script>

<div class="btn-group-vertical variant-glass rounded fixed right-0 mx-5 my-2 z-10">
	<button on:click={() => modalStore.trigger(settingsModal)}> Opciones </button>
	<button on:click={() => modalStore.trigger(controlsModal)}>
		Cómo jugar
	</button>
</div>

{#if board.size == 0}
	<div class="w-1/2 left-1/4 top-10 z-50 fixed my-auto">
		<ProgressBar />
	</div>
{:else}
	<div transition:fade>
		<Board board={$board} />
	</div>
	<div in:fly={{ y: -10 }} out:fly={{ y: -10 }} class="flex fixed rounded m-5 justify-between z-50">
        <ProgressHex progress={$board.flags} total={$board.mines} />
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
					on:click={() => modalStore.trigger(settingsModal)}
				>
					Configurar tablero
				</button>
			</div>
		</div>
	{/if}
	{#if $touchscreen}
		<div
			transition:fly
			class="fixed mx-auto rounded-full card bg-slate-500 left-0 right-0 bottom-0 mb-20 flex justify-between h-12 w-fit"
		>
			<div
				class="absolute m-2 h-8 rounded transition-all -z-50
                    ease-in-out duration-300 opacity-10 bg-white
                    {$flag ? 'rounded-e-full' : 'rounded-s-full'}
                "
				style="transform: translateX({$flag ? 4.5 : 0}rem); width: 4.4rem;"
			/>
			<button
				on:click={() => ($flag = false)}
				class="text-3xlg rounded-s-full rounded-e p-0 mr-0 m-4 w-16"
				style="font-size: 3rem;"
			>
				<!-- Magnifying glass -->
                <MagnifyingGlass />
			</button>
			<button
				on:click={() => ($flag = true)}
				class="rounded-e-full rounded-s ml-0 p-0 m-4 w-16"
				style="font-size: 3rem;"
			>
				<Flag />
			</button>
		</div>
	{/if}
{/if}

<Modal />
