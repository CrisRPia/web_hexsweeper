<script lang="ts">
	import { LogicCell } from './types/LogicCell';
	import { main_board } from './main_board';
	import type { Board } from './types/Board';

	export let width = 30;
	let logic = new LogicCell();
	let clickCount = 0;
	export let x: number;
	export let y: number;
	let board = $main_board;
	board.subscribe((_: Board) => {
		logic = board.cells[x][y];
	});

	function handleClick(e: MouseEvent) {
        if (e.shiftKey) { return; }
		clickCount++;
		discover();
	}

	function discover() {
		if (!logic.flagged) {
			board.discover_animate(x, y);
		}
	}

	function flag(e: MouseEvent) {
        if (e.shiftKey) { return; }
		e.preventDefault();
		board.flag(x, y);
	}
</script>

<div class="hexagon hexagon2 inline-block" style="--width: {width}px">
	<div class="hexagon-in1">
		<div
			id="c"
			tabindex="-1"
			role="button"
            on:dblclick={() => board.expand(x, y)}
			on:click={handleClick}
			on:contextmenu={flag}
			on:mouseover={() => board.hoverIn(x, y)}
			on:mouseout={() => board.hoverOut(x, y)}
			class="
            hexagon-in2
            hex
            {logic.forbidden
				? 'bg-opacity-0'
				: logic.flagged
				? 'bg-success-500'
				: logic.mined && logic.discovered
				? 'bg-error-500'
				: logic.discovered
				? 'bg-tertiary-400 bg-opacity-20'
				: 'bg-tertiary-400 bg-opacity-50'}
            w-8
            inline-block
            transition-colors
            select-none
            hover:brightness-200
            {logic.highlighted ? 'brightness-125' : ''}
            "
		>
			<p
				class="
                    text-white
                    {logic.discovered && !logic.mined && logic.value != 0 ? 'opacity-100' : 'opacity-0'}
                    {logic.forbidden ? 'blur' : ''}
            "
			>
				{logic.value}
			</p>
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

