<script lang="ts">
	import { main_board } from './main_board';
	import { Board } from './types/Board';
	export let size: number;
	export let mines: number;
	export let cls = '';
	export let diagonal: boolean = $main_board.diagonalAdjacency;
	export let orthogonal: boolean = $main_board.orthogonalAdjacency;
    export let unknowns: number = $main_board.initialUnknowns;

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function regenerate() {
		if ($main_board.size == 0) {
			return;
		}
		main_board.set(new Board(0, 0, false, false, 0));
		// stuff bugs out if I dont wait. idk. FIX if bored
		// TODO make the board generate while waiting; make it async
		await sleep(1000);
		main_board.set(new Board(size, mines, orthogonal, diagonal, unknowns));
	}
</script>

<button disabled={$main_board.size == 0} class={cls} on:click={regenerate}>
	{$main_board.size == 0 ? 'Regenerando tablero...' : 'Regenerar tablero'}
</button>
