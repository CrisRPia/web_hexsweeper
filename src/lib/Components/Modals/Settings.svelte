<script lang="ts">
    import { createBubbler, stopPropagation } from 'svelte/legacy';

    const bubble = createBubbler();
    import {
        Accordion,
        AccordionItem,
        LightSwitch,
        SlideToggle
    } from "@skeletonlabs/skeleton";
    import { Board as LogicBoard } from "$lib/types/Board";
    import { main_board } from "$lib/stores/main_board.svelte";
    import { settings } from "$lib/stores/settings.svelte";
    import Board from "$lib/Components/Board/Board.svelte";
    import RegenerateButton from "$lib/Components/UI/RegenerateButton.svelte";
    let difficulty =
        $state($main_board.mines / ($main_board.size * $main_board.size) || 0.15);
    let size = $state($main_board.size);
    let orthogonal = $state($main_board.orthogonalAdjacency);
    let diagonal = $state($main_board.diagonalAdjacency);
    let unknown = $state($main_board.initialUnknowns != 0);
    let punish = $state($main_board.punish);

    let sampleBoard = $derived(
        new LogicBoard(5, 25 * difficulty, orthogonal, diagonal, 0)
    );
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
                    <option value={10}> Pequeño </option>
                    <option value={20}> Mediano </option>
                    <option value={30}> Grande </option>
                    <option value={40}> Enorme </option>
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
                <AccordionItem
                    class={!diagonal && !orthogonal
                        ? "variant-ghost-warning"
                        : ""}
                >
                    {#snippet lead()}
                                    
                            <div onclick={stopPropagation(bubble('click'))}>
                                <SlideToggle
                                    active="bg-success-500"
                                    bind:checked={diagonal}
                                    name="slider-diagonal"
                                    >Adyacencia diagonal</SlideToggle
                                >
                            </div>
                        
                                    {/snippet}
                    {#snippet summary()}
                                    
                            <p></p>
                        
                                    {/snippet}
                    {#snippet content()}
                                    
                            Los valores de las celdas y las expansiones considerarán
                            las celdas que comparten
                            <span class="variant-ghost-secondary rounded"
                                >vértices</span
                            >
                            como vecinas.
                        
                                    {/snippet}
                </AccordionItem>
                <AccordionItem
                    class={!diagonal && !orthogonal
                        ? "variant-ghost-warning"
                        : ""}
                >
                    {#snippet lead()}
                                    
                            <div onclick={stopPropagation(bubble('click'))}>
                                <SlideToggle
                                    active="bg-success-500"
                                    bind:checked={orthogonal}
                                    name="slider-orthogonal"
                                    >Adyacencia ortogonal</SlideToggle
                                >
                            </div>
                        
                                    {/snippet}
                    {#snippet summary()}
                                    
                            <p></p>
                        
                                    {/snippet}
                    {#snippet content()}
                                    
                            Los valores de las celdas y las expansiones considerarán
                            las celdas que comparten
                            <span class="variant-ghost-secondary rounded"
                                >lados</span
                            >
                            como vecinas.
                        
                                    {/snippet}
                </AccordionItem>
                <AccordionItem>
                    {#snippet lead()}
                                    
                            <div onclick={stopPropagation(bubble('click'))}>
                                <SlideToggle
                                    bind:checked={unknown}
                                    active="bg-success-500"
                                    name="slider-unknown"
                                    >Generar incógnitas</SlideToggle
                                >
                            </div>
                        
                                    {/snippet}
                    {#snippet summary()}
                                    
                            <p></p>
                        
                                    {/snippet}
                    {#snippet content()}
                                    
                            Generar algunas celdas sin minas carentes de
                            información. La frecuencia de las mismas depende de la
                            dificultad.
                        
                                    {/snippet}
                </AccordionItem>
                <AccordionItem>
                    {#snippet lead()}
                                    
                            <div onclick={stopPropagation(bubble('click'))}>
                                <SlideToggle
                                    disabled
                                    active="bg-success-500"
                                    name="slider-winnable"
                                    >Garantizar tablero ganable</SlideToggle
                                >
                            </div>
                        
                                    {/snippet}
                    {#snippet summary()}
                                    
                            <p></p>
                        
                                    {/snippet}
                    {#snippet content()}
                                    
                            Al generar el tablero se revelan suficientes celdas para
                            poder ganar sin tener que adivinar. Esta generación
                            puede llevar un tiempo, dependiendo de la configuración
                            y la suerte.
                        
                                    {/snippet}
                </AccordionItem>
                <AccordionItem>
                    {#snippet lead()}
                                    
                            <div onclick={stopPropagation(bubble('click'))}>
                                <SlideToggle
                                    bind:checked={punish}
                                    active="bg-success-500"
                                    name="slider-penalize"
                                    >Penalizar mala expansión</SlideToggle
                                >
                            </div>
                        
                                    {/snippet}
                    {#snippet summary()}
                                    
                            <p></p>
                        
                                    {/snippet}
                    {#snippet content()}
                                    
                            Al intentar expandir un hexágono inválido, la celda
                            seleccionada se vuelve una incógnita.
                        
                                    {/snippet}
                </AccordionItem>
            </Accordion>
        </label>
    </div>
    <h3 class="h3">Misceláneo</h3>
    <SlideToggle
        bind:checked={$settings.touchscreen}
        active="bg-success-500"
        name="slider-penalize">Controles táctiles</SlideToggle
    >
    <h3 class="h3">Previsualización</h3>
    <div class="h-fit w-fit mx-auto">
        <Board board={$sampleBoard} moveable={false} />
    </div>

    <div class="card-footer">
        <RegenerateButton
            {orthogonal}
            {diagonal}
            {size}
            {punish}
            mines={size * size * difficulty}
            unknowns={unknown ? size * size * difficulty : 0}
            cls="btn variant-filled-error rounded mt-1 w-full"
        />
        <p class="text-sm text-center">Desarrollado por Cristian Rodríguez.</p>
    </div>
</div>

<style>
</style>
