export const modals = $state({
    settings: false as boolean,
    controls: false as boolean,
} satisfies Record<string, boolean>);

type StaticModalName = keyof typeof modals;

export function openModal(name: StaticModalName) {
    modals[name] = true;
}

export function closeModal(name: StaticModalName) {
    modals[name] = false;
}
