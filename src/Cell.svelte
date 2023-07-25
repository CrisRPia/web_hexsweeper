<script lang="ts">
	import type { LogicCell } from './types/LogicCell';
	import type { Board } from './types/Board';
    import { flag } from "./settings";

	export let width = 30;
	let logic: LogicCell;
	let dragging: boolean = false;
	let xMemory = 0;
	let yMemory = 0;
	export let x: number;
	export let y: number;
	export let board: Board;

	board.subscribe(() => {
		logic = board.cells[x][y];
	});

	function handleMove(e: MouseEvent) {
		dragging = e.buttons != 0;
	}

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

	function handleDown(e: MouseEvent) {
		yMemory = e.y;
		xMemory = e.x;
	}
	function handleUp(e: MouseEvent) {
		if (yMemory === e.y && xMemory === e.x && e.button != 2) {
            if ($flag) {
                flagCell(e);
            } else {
                discover();
            }
		}
	}
	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			discover();
		}
	}
</script>

<div class="hexagon hexagon2 inline-block" style="--width: {width}px">
	<div class="hexagon-in1">
		<div
			id="c"
			tabindex={x * 10 + y + 20}
			role="button"
			on:mousedown={handleDown}
			on:mouseup={handleUp}
			on:mousemove={handleMove}
			on:keypress={handleKey}
			on:contextmenu={flagCell}
			on:focus|preventDefault={() => board.hoverIn(x, y)}
			on:blur|preventDefault={() => board.hoverOut(x, y)}
			on:mouseover={() => board.hoverIn(x, y)}
			on:mouseout={() => board.hoverOut(x, y)}
			class="
            hexagon-in2
            hex
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
	#c {
		transition-duration: 150ms;
		transition-timing-function: ease-in;
	}
	p {
		transition-duration: 150ms;
		transition-timing-function: ease-in;
		position: absolute;
		top: 50%;
		left: 50%;
		font-family: monospace;
		transform: translate(-50%, -50%);
	}
	.hexagon {
		overflow: hidden;
		visibility: hidden;
		-webkit-transform: rotate(120deg);
		-moz-transform: rotate(120deg);
		-o-transform: rotate(120deg);
		transform: rotate(120deg);
	}
	.hexagon-in1 {
		overflow: hidden;
		width: 100%;
		height: 100%;
		-webkit-transform: rotate(-60deg);
		-moz-transform: rotate(-60deg);
		-o-transform: rotate(-60deg);
		transform: rotate(-60deg);
	}

	.hexagon-in2 {
		width: 100%;
		height: 100%;
		visibility: visible;
		-webkit-transform: rotate(-60deg);
		-moz-transform: rotate(-60deg);
		-o-transform: rotate(-60deg);
		transform: rotate(-60deg);
	}

	.hexagon2 {
		--width: 40px;
		--base_margin: calc(var(--width) * -1.1);
		width: var(--width);
		height: calc(var(--width) * 2);
		margin: calc(var(--base_margin) + 1px) 0 0 calc(var(--width) * 0.05);
	}
</style>
