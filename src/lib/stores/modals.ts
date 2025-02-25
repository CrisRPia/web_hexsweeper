import { modalStore, type ModalSettings } from "@skeletonlabs/skeleton";
import Settings from "$lib/Components/Modals/Settings.svelte";
import Controls from "$lib/Components/Modals/Controls.svelte";

const staticModals = {
    settings: {
        type: "component",
        component: { ref: Settings }
    },
    controls: {
        type: "component",
        component: { ref: Controls }
    }
} as const satisfies Record<string, ModalSettings>;

type StaticModalName = keyof typeof staticModals;

export function openModal(name: StaticModalName) {
    modalStore.trigger(staticModals[name]);
}
