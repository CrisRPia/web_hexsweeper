<script lang="ts">
	import { fade } from 'svelte/transition';
	import Cell from './Cell.svelte';
	import type { Board } from './types/Board';
	import Panzoom from '@panzoom/panzoom';
	import type { PanzoomObject } from '@panzoom/panzoom';

	let wrapper: HTMLDivElement;

	export let board: Board;
	export let moveable = true;
	export let width = 40;

	let panzoomElement;
	let panzoom: PanzoomObject;

	// This function is called when the div is mounted in the DOM
	function initPanzoom(node: HTMLElement) {
		if (!moveable) {
			return;
		}
		panzoomElement = node;
		panzoom = Panzoom(panzoomElement, {
			handleStartEvent: (event) => {
			},
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
	id={moveable ? 'wrap' : undefined}
	on:wheel={panzoom.zoomWithWheel}
	bind:this={wrapper}
	class={moveable ? 'overflow-hidden -z-1' : 'pl-5 pt-7 -mb-3 w-fit'}
	style={moveable
		? 'width: 100vw; height: 100vh; left: 0px; position:absolute'
		: undefined}
>
	<div use:initPanzoom id="mover" class="w-fit h-fit">
		<div
			id="c"
			class="relative whitespace-nowrap transition-transform w-fit h-fit"
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

<style>
	#c {
		overflow: visible;
	}
	#wrap {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>
