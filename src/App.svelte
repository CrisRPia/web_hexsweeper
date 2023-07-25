<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Modal, ProgressBar, modalStore } from '@skeletonlabs/skeleton';
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

	let index = 0;

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

<div class="btn-group-vertical variant-glass rounded fixed right-0 m-2 z-10">
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
		<Board board={$main_board} />
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
			class="fixed mx-auto rounded-full card bg-slate-500 left-0 right-0 bottom-0 mb-20 flex justify-between h-36 w-fit"
		>
			<div
				class="absolute m-2 h-32 rounded transition-all -z-50
                    ease-in-out duration-300 opacity-10 bg-white
                    {$flag ? 'rounded-e-full' : 'rounded-s-full'}
                "
				style="transform: translateX({$flag ? 8.5 : 0}rem); width: 8.5rem;"
			/>
			<button
				on:click={() => ($flag = false)}
				class="text-3xlg rounded-s-full rounded-e p-0 mr-0 m-4 w-32"
				style="font-size: 3rem;"
			>
				<!-- Magnifying glass -->
				<svg
					width="100%"
					style="transform: rotate(-30deg);"
					height="100%"
					viewBox="0 0 258 497"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M43 129C43 81.5035 81.5035 43 129 43C176.496 43 215 81.5035 215 129C215 176.496 176.496 215 129 215C81.5035 215 43 176.496 43 129ZM129 0C57.7553 0 0 57.7553 0 129C0 192.919 46.4892 245.981 107.5 256.216V491.5C107.5 494.261 109.739 496.5 112.5 496.5H145.5C148.261 496.5 150.5 494.261 150.5 491.5V256.216C211.511 245.981 258 192.919 258 129C258 57.7553 200.245 0 129 0Z"
						fill="white"
					/>
				</svg>
			</button>
			<button
				on:click={() => ($flag = true)}
				class="rounded-e-full rounded-s ml-0 p-0 m-4 w-32"
				style="font-size: 3rem;"
			>
				<!-- flag -->
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 282 415"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M0 5C0 2.23857 2.23857 0 5 0H38C40.7614 0 43 2.23858 43 5V26H143C154.046 26 163 34.9543 163 46V47H262C273.046 47 282 55.9543 282 67V167C282 178.046 273.046 187 262 187H164C152.954 187 144 178.046 144 167V166H43V410C43 412.761 40.7614 415 38 415H5C2.23857 415 0 412.761 0 410V5Z"
						fill="white"
					/>
				</svg>
			</button>
		</div>
	{/if}
{/if}

<Modal />
