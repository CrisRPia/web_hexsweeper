<script lang="ts">
    import { fade } from 'svelte/transition';
	import Cell from './Cell.svelte';
	import { main_board } from './main_board';
	import { Board } from './types/Board';

	export let size = 5;
	let mines = Math.floor(size * size * 0.2);
	let scaling = 100;

	$: {
		mines = Math.floor(size * size * 0.1);
		main_board.set(new Board(size, mines));
	}
	let board: Board = $main_board;
	main_board.subscribe((val: Board) => {
		board = val;
	});

	function handleScroll(e: WheelEvent) {
		let change = e.deltaY * -0.1 * Math.log2(scaling);
		if (change > 0) {
			if (scaling + change >= 500) {
				scaling = 500;
				return;
			}
			scaling += change;
		} else {
			if (scaling + change <= 50) {
				scaling = 50;
				return;
			}
			scaling += change;
		}
	}
	let tx = 0;
	let ty = 0;
	let dragging = false;

	function mouseDown(e: MouseEvent) {
		if (e.shiftKey) {
			e.preventDefault;
			dragging = true;
		}
	}

	function mouseUp() {
		dragging = false;
	}

	function mouseDrag(e: MouseEvent) {
		if (dragging) {
			tx += e.movementX;
			ty += e.movementY;
		}
	}
</script>

<div
	id="wrap"
	on:wheel|preventDefault={handleScroll}
	class="overflow-hidden flex items-center justify-center -z-1"
	style="width: 100vw; height: 100vh; left: 0px; position:absolute"
	on:mousedown|capture={mouseDown}
	on:mouseup={mouseUp}
	on:mouseleave={mouseUp}
	on:mousemove|capture={mouseDrag}
>
	<div id="mover" style="transform: translate({tx}px, {ty}px);">
		<div
			id="c"
			class="relative whitespace-nowrap transition-transform w-fit h-fit"
			style="transform: scale({scaling / 100});"
		>
			{#each board.cells as row, x}
				<div
					on:contextmenu={(e) => {
						e.preventDefault();
					}}
					style="
                        line-height: 0;
                        vertical-align: top;
                        transform: translateX({x % 2 == 0 ? (-50 / board.size).toString() : '0'}%);
                    "
				>
					{#each row as _, y}
						{#if x < size && y < size}
							<div in:fade class="inline-block">
								<Cell {x} {y} width={40} />
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
