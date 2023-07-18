<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { main_board as board, main_board } from './main_board';
    let difficulty = $board.mines / ($board.size * $board.size) || 0.15;
    let size = $board.size;

    function regenerate() {
        $board.regenerate(size, size * size * difficulty);
    }
</script>

<div class="p-2 overflow-scroll card w-fit m-h-1/2 backdrop-hue-rotate-60 variant-glass">
	<div class="card-header mb-5 flex justify-between">
		<h2 class="justify-start h2">Opciones</h2>
		<div class="">
			<LightSwitch />
		</div>
	</div>
	<div class="">
		<label class="label">
			<span>Tablero</span>
			<div class="flex justify-between">
				<select bind:value={size} class="select variant-glass- mr-1">
					<option value={10}> Pequeño (10) </option>
					<option value={20}> Mediano (20) </option>
					<option value={30}> Grande (30) </option>
					<option value={40}> Enorme (40) </option>
				</select>
				<select bind:value={difficulty} class="select ml-1">
					<option value={0.1}> Fácil </option>
					<option value={0.15}> Normal </option>
					<option value={0.2}> Difícil </option>
					<option value={0.25}> Plagado </option>
				</select>
			</div>
            <button 
            class="btn variant-filled-error rounded mt-1 w-full"
            on:click={regenerate}
            >Regenerar tablero</button>
		</label>
	</div>
	<div class="card-footer mt-10">
		<p class="">Desarrollado por Cristian Rodríguez.</p>
	</div>
</div>

<style>
</style>
