<script lang="ts">
	import { Accordion, AccordionItem, LightSwitch, SlideToggle } from '@skeletonlabs/skeleton';
	import { main_board as board } from './main_board';
	let difficulty = $board.mines / ($board.size * $board.size) || 0.15;
	let size = $board.size;

	function regenerate() {
		$board.regenerate(size, size * size * difficulty);
	}
</script>

<div 
    class="p-2 card w-modal-slim overflow-y-auto backdrop-hue-rotate-60 variant-glass"
    style="max-height: calc(100% - 5rem);"
    >
	<div class="card-header mb-5 flex justify-between items-center">
		<h2 class="h2">Opciones</h2>
		<div class="">
			<LightSwitch />
		</div>
	</div>
	<div class="overflow-y-auto">
		<label class="label">
			<h3 class="h3">Tablero</h3>
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
			<h3 class="h3">Mecánicas (WIP)</h3>
			<Accordion>
				<AccordionItem>
					<svelte:fragment slot="lead">
						<SlideToggle disabled active="bg-success-500" checked name="slider-laber"
							>Adyacencia diagonal</SlideToggle
						>
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<p />
					</svelte:fragment>
					<svelte:fragment slot="content">
						Los valores de las celdas y las expansiones considerarán las celdas que comparten
						<span class="variant-ghost-warning rounded">vértices</span>
						como vecinas.
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem>
					<svelte:fragment slot="lead">
						<SlideToggle disabled active="bg-success-500" checked name="slider-laber"
							>Adyacencia ortogonal</SlideToggle
						>
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<p />
					</svelte:fragment>
					<svelte:fragment slot="content">
						Los valores de las celdas y las expansiones considerarán las celdas que comparten
						<span class="variant-ghost-warning rounded">lados</span>
						como vecinas.
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem>
					<svelte:fragment slot="lead">
						<SlideToggle disabled active="bg-success-500" name="slider-laber"
							>Generar incógnitas</SlideToggle
						>
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<p />
					</svelte:fragment>
					<svelte:fragment slot="content">
						Generar algunas celdas carentes de información. La
                        frecuencia de las mismas depende de la dificultad.
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem>
					<svelte:fragment slot="lead">
						<SlideToggle disabled active="bg-success-500" name="slider-laber"
							>Garantizar tablero ganable</SlideToggle
						>
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<p />
					</svelte:fragment>
					<svelte:fragment slot="content">
						Al generar el tablero se revelan suficientes celdas para
                        poder ganar sin tener que adivinar. Esta generación
                        puede llevar un tiempo, dependiendo de la configuración
                        y la suerte.
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem>
					<svelte:fragment slot="lead">
						<SlideToggle disabled active="bg-success-500" checked name="slider-laber"
							>Penalizar mala expansión</SlideToggle
						>
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<p />
					</svelte:fragment>
					<svelte:fragment slot="content">
						Al intentar expandir un hexágono inválido, la celda
                        seleccionada se vuelve una incógnita.
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		</label>
		<button class="btn variant-filled-error rounded mt-1 w-full" on:click={regenerate}>
			Generar tablero
		</button>
	</div>

	<div class="card-footer mt-10">
		<p class="">Desarrollado por Cristian Rodríguez.</p>
	</div>
</div>

<style>
</style>
