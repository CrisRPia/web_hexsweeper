<script lang="ts">
	import { fade } from 'svelte/transition';
	import Cell from './Cell.svelte';
	import type { Board } from './types/Board';

	let scaling = 1;
	let moverDiv: HTMLDivElement;

	export let board: Board;
	export let moveable = true;
	export let width = 40;

	function handleScroll(e: WheelEvent) {
		let change = (e.deltaY * -0.1 * Math.log2(scaling * 100)) / 100;
        let changePercent = change / scaling;
        let coords = moverDiv.getBoundingClientRect();
        console.log(changePercent);
        console.log(scaling);
        tx += tx * changePercent + (-e.x + coords.width / 2 + coords.x) * changePercent;
        ty += ty * changePercent + (-e.y + coords.width / 2 + coords.y) * changePercent;
        scale(change);
        console.log(scaling);
	}

	function scale(change: number) {
		if (change > 0) {
			if (scaling + change >= 5) {
				scaling = 5;
				return;
			}
			scaling += change;
		} else {
			if (scaling + change <= 0.5) {
				scaling = 0.5;
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
	id={moveable ? 'wrap' : undefined}
	on:wheel={moveable ? handleScroll : undefined}
	class={moveable
		? 'overflow-hidden flex items-center justify-center -z-1'
		: 'pl-5 pt-7 -mb-3 w-fit'}
	style={moveable
		? 'width: 100vw; height: 100vh; left: 0px; position:absolute'
		: undefined}
	on:mousedown|capture={moveable ? mouseDown : undefined}
	on:mouseup={moveable ? mouseUp : undefined}
	on:mouseleave={moveable ? mouseUp : undefined}
	on:mousemove|capture={moveable ? mouseDrag : undefined}
>
	<div
		id="mover"
        class=""
		style="transform: translate({tx}px, {ty}px);"
	>
		<div
			id="c"
            bind:this={moverDiv}
			class="relative whitespace-nowrap transition-transform w-fit h-fit"
			style="transform: scale({scaling});"
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
