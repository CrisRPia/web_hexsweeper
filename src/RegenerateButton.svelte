<script lang="ts">
	import { main_board } from "./main_board";
    import { Board } from "./types/Board";
    export let size: number;
    export let mines: number;
    export let cls = '';

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function regenerate() {
        if ($main_board.size == 0) {
            return;
        }
		main_board.set(new Board(0, 0));
		// stuff bugs out if I dont wait. idk. FIX if bored
        // TODO make the board generate while waiting; make it async
		await sleep(1000);
        console.log(" ");
		main_board.set(new Board(size, mines));
	}
</script>
<button disabled={$main_board.size == 0} class={cls} on:click={regenerate}>
    {$main_board.size == 0 ? 'Regenerando tablero...' : 'Regenerar tablero' }
</button>
