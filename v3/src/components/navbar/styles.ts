export const dockStyles = {
  // Base style for launcher, tab buttons, and pin control.
  controlBase:
    "glass-ui flex h-8 shrink-0 items-center gap-1.5 rounded-full border-white/25 !bg-black/85 px-2.5 text-xs !text-white transition-colors",
  // Hover style for inactive controls.
  controlIdle: "hover:border-white/45 hover:!bg-black/75 hover:!text-white",
  // Selected/active control state.
  controlActive: "border-white/65 !bg-black !text-white",
  // Main nav links container.
  rail: "glass-ui flex items-center gap-1 overflow-x-auto rounded-full border-white/20 !bg-black/80 p-1",
  // Outer wrapper for expanded dock controls.
  expandedWrap: "flex items-center gap-1 p-1",
  // Small collapsed trigger pill.
  collapsedPill:
    "glass-ui flex h-8 w-12 items-center justify-center rounded-full border-white/30 !bg-black/85 text-white/90 transition-colors hover:border-white/45 hover:!bg-black hover:text-white",
  // Legacy wrapper kept for compatibility with older collapsed component.
  collapsedWrap: "flex items-center gap-1 p-1",
} as const;
