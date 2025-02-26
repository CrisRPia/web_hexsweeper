<script lang="ts">
    import { main_board } from "$lib/stores/main_board.svelte";
    import { Board } from "$lib/types/Board";

    interface Props {
        size: number;
        mines: number;
        cls?: string;
        diagonal?: boolean;
        orthogonal?: boolean;
        unknowns?: number;
        punish?: boolean;
    }

    let {
        size,
        mines,
        cls = "",
        diagonal = $main_board.diagonalAdjacency,
        orthogonal = $main_board.orthogonalAdjacency,
        unknowns = $main_board.initialUnknowns,
        punish = $main_board.punish
    }: Props = $props();

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
        main_board.set(
            new Board(size, mines, orthogonal, diagonal, unknowns, punish)
        );
    }
</script>

<button disabled={$main_board.size == 0} class={cls} onclick={regenerate}>
    {$main_board.size == 0 ? "Regenerando tablero..." : "Regenerar tablero"}
</button>
