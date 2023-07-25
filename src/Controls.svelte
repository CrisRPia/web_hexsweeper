<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { Board as LogicBoard } from './types/Board';
	import Board from './Board.svelte';
	import { touchscreen } from './settings';
	import type { LogicCell } from './types/LogicCell';
	import { main_board } from './main_board';
	import { fly } from 'svelte/transition';
	import Flag from './Flag.svelte';
	import MagnifyingGlass from './MagnifyingGlass.svelte';
	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'top'
	};
	let mine = new LogicBoard(1, 1);
	mine.discover_animate(0, 0);
	let discovered = new LogicBoard(1, 0);
	discovered.discover_animate(0, 0);
	let sampleBoard = new LogicBoard(
		4,
		6,
		$main_board.orthogonalAdjacency,
		$main_board.diagonalAdjacency
	);
	sampleBoard.cells.forEach((row) => {
		row.forEach((c: LogicCell) => {
			c.discovered = true;
		});
	});
	let flag = new LogicBoard(1, 1);
	flag.flag(0, 0);
	let unknown = new LogicBoard(4, 5);
	unknown.cells.forEach((row) => {
		row.forEach((c: LogicCell) => {
			c.forbidden = !c.mined;
			c.discovered = c.mined;
		});
	});
</script>

<div
	class="p-2 m-2 card overflow-auto max-w-prose backdrop-hue-rotate-60 variant-glass"
	style="max-height: calc(100% - 5rem);"
>
	<h2 class="h1 mb-5 text-center">Cómo jugar</h2>
	<div class="flex justify-between items-center">
		<h3 class="h2 mb-1">Controles</h3>
		<label class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" bind:checked={$touchscreen} />
			<p>Pantalla táctil</p>
		</label>
	</div>
	{#if !$touchscreen}
		<div class="table-container mb-5" in:fly={{ y: 10, duration: 500 }}>
			<table class="table table-hover variant-ringed">
				<thead>
					<tr class="variant-glass-secondary">
						<th>Teclas</th>
						<th>Acción</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Click izquierdo</td>
						<td
							>Descubrir /
							<span
								use:popup={popupHover}
								class="variant-ghost-warning rounded p-1">Expandir</span
							>
							celda</td
						>
					</tr>
					<tr>
						<td>Click derecho</td>
						<td>Marcar / desmarcar bandera</td>
					</tr>
					<tr>
						<td>Click + movimiento</td>
						<td>Mover cámara</td>
					</tr>
					<tr>
						<td>Rueda del ratón</td>
						<td>Zoom</td>
					</tr>
				</tbody>
			</table>
		</div>
	{:else}
		<div class="table-container mb-5" in:fly={{ y: 10, duration: 500 }}>
			<table class="table table-hover variant-ringed">
				<thead>
					<tr class="variant-glass-secondary">
						<th>Modo</th>
						<th>Celda</th>
						<th>Acción</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><div class="h-5 w-fit"><MagnifyingGlass /></div></td>
						<td>Niebla</td>
						<td>Descubrir celda</td>
					</tr>
					<tr>
						<td><div class="h-5 w-fit"><MagnifyingGlass /></div></td>
						<td>Celda con valor</td>
						<td>
							<span
								use:popup={popupHover}
								class="variant-ghost-warning rounded p-1">Expandir</span
							>
							celda</td
						>
					</tr>
					<tr>
						<td><div class="h-5 w-fit"><Flag /></div></td>
						<td>Niebla</td>
						<td>Poner / quitar bandera</td>
					</tr>
				</tbody>
			</table>
		</div>
	{/if}
	<h3 class="h2 mb-1">Mecánicas</h3>
	El objetivo del juego es descubrir toda la niebla mientras se marcan con bandera
	todas las minas.
	<h2 class="h2 flex justify-between items-center">
		<span>Niebla</span>
		<div class="inline">
			<Board
				board={new LogicBoard(1, Math.floor(Math.random() + 0.5))}
				moveable={false}
			/>
		</div>
	</h2>
	La niebla son las celdas sin descubrir; pueden contener minas o celdas con valor.
	Clickar en ellas revela su contenido, las "descubre".
	<h2 class="h2 flex justify-between items-center">
		<span>Minas</span>
		<div class="inline">
			<Board board={mine} moveable={false} />
		</div>
	</h2>
	Celdas a evitar. Descubrirlas puede resultar en derrota o una reducción de puntaje.
	<h2 class="h2 flex justify-between items-center">
		<span>Celdas con valor</span>
		<div class="inline">
			<Board board={discovered} moveable={false} />
		</div>
	</h2>
	<div class="flex justify-evenly items-center">
		<Board board={sampleBoard} moveable={false} />
		<p class="m-2">
			Son las celdas sin minas que han sido descubiertas; muestran las cantidad
			de celdas vecinas. De no tener celdas vecinas, no muestran valor alguno.
			Al poner el cursor arriba, se resaltan las celdas vecinas.
		</p>
	</div>
	<h2 class="h2 flex justify-between items-center">
		<span>Banderas</span>
		<div class="inline">
			<Board board={flag} moveable={false} />
		</div>
	</h2>
	Celdas marcadas como seguras, no se pueden descubrir hasta desmarcarse.
	<div class="flex justify-evenly items-center overflow-x-clip">
		<div>
			<h2 class="h2 flex justify-between items-center">
				<span>Incógnitas</span>
				<div class="inline" />
			</h2>
			Celdas sin minas ni información. Pueden generarse con el tablero o ser una
			penalización. Véase que este tablero tiene celdas invisibles: esas son incógnitas.
		</div>
		<Board board={unknown} moveable={false} />
	</div>
</div>

<div class="card p-4 variant-outline-warning" data-popup="popupHover">
	<p class="text-sm max-w-prose">
		Para expandir exitosamente, se debe cumplir una de las siguientes
		condiciones:
	</p>
	<p class="text-sm code">
		Minas descubiertas + Celdas sin descubrir + Banderas = Valor de celda
	</p>
	<p class="text-sm mt-2 code">
		Minas descubiertas + Banderas = Valor de celda
	</p>
	<div class="arrow variant-filled-warning" />
</div>
