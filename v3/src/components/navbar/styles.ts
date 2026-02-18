export const dockStyles = {
  controlBase:
    "glass-ui flex h-8 shrink-0 items-center gap-1.5 rounded-full border-white/25 !bg-black/85 px-2.5 text-xs !text-white transition-colors",
  controlIdle: "hover:border-white/45 hover:!bg-black/75 hover:!text-white",
  controlActive: "border-white/65 !bg-black !text-white",
  rail: "glass-ui flex items-center gap-1 overflow-x-auto rounded-full border-white/20 !bg-black/85 p-1",
  expandedWrap: "flex items-center gap-1 p-1",
  drawer:
    "absolute bottom-12 left-1/2 w-[min(22rem,calc(100vw-0.75rem))] -translate-x-1/2 rounded-2xl bg-[#11131a]/90 p-2.5 shadow-md glass-ui md:w-[26rem]",
  searchWrap: "glass-ui mb-2 flex items-center gap-2 rounded-lg border-white/20 bg-black/35 px-2.5 py-1.5",
  actionBtn:
    "glass-ui flex items-center gap-2 rounded-lg border-white/20 bg-black/35 px-2.5 py-1.5 text-left text-sm text-white/90 hover:bg-black/55 hover:text-white",
  collapsedWrap: "flex items-center gap-1 p-1",
} as const;
