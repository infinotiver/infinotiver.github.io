export const dockStyles = {
  // Base style for launcher, tab buttons, and pin control.
  controlBase:
    "glass-ui flex h-8 shrink-0 items-center gap-1.5 rounded-full border-white/25 !bg-black/85 px-2.5 text-xs !text-white transition-colors",
  // Hover style for inactive controls.
  controlIdle: "hover:border-black/45 hover:!bg-black/75 hover:!text-white",
  // Selected/active control state.
  controlActive: "border-white/65 !bg-black !text-white",
  // Main nav links container.
  rail: "glass-ui flex items-center gap-1 overflow-x-auto rounded-full border-white/20 !bg-black/30 p-1",
  // Outer wrapper for expanded dock controls.
  expandedWrap: "flex items-center gap-1 p-1",
  // Floating launcher panel container.
  drawer:
    "absolute bottom-12 left-1/2 w-[min(22rem,calc(100vw-0.75rem))] -translate-x-1/2 rounded-2xl bg-[#11131a]/90 p-2.5 shadow-md glass-ui md:w-[26rem]",
  // Search input row inside launcher panel.
  searchWrap: "glass-ui mb-2 flex items-center gap-2 rounded-lg border-white/20 bg-black/35 px-2.5 py-1.5",
  // Action buttons inside launcher panel.
  actionBtn:
    "glass-ui flex items-center gap-2 rounded-lg border-white/20 bg-black/35 px-2.5 py-1.5 text-left text-sm text-black/90 hover:!bg-black/20",
  // Wrapper used in collapsed dock mode.
  collapsedWrap: "flex items-center gap-1 p-1",
} as const;
