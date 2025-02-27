<script>
    import { modals } from "$lib/stores/modals.svelte";
    import { Modal } from "@skeletonlabs/skeleton-svelte";
    import Controls from "./Controls.svelte";
    import Settings from "./Settings.svelte";
</script>

<Modal
    bind:open={modals.controls}
    contentBase="card backdrop-blur-lg backdrop-brightness-50 p-4 space-y-4 shadow-xl scroll-y-auto overflow-y-scroll overflow-hidden w-screen-sm max-h-[calc(100dvh-5rem)]"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <Controls></Controls>
    {/snippet}
</Modal>
<Modal
    bind:open={modals.settings}
    contentBase="card backdrop-blur-lg backdrop-brightness-50 p-4 space-y-4 shadow-xl scroll-y-auto overflow-y-scroll overflow-hidden w-screen-sm max-h-[calc(100dvh-5rem)]"
    backdropClasses="backdrop-blur-sm"
>
    {#snippet content()}
        <Settings></Settings>
    {/snippet}
</Modal>
