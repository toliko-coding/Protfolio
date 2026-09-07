// Terminal and ExplorerBootGate are siblings with no shared parent state
// (see app/layout.tsx), so they can't just share a prop. A window event is
// the smallest way to let ExplorerBootGate know the instant boot actually
// finishes — whether it played out in full or was skipped by a click —
// without a context provider for something this narrow.
export const BOOT_FINISHED_EVENT = "anatolikot:boot-finished";
