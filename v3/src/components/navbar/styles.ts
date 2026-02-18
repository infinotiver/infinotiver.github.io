export const dockStyles = {
  controlBase:
    "flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-white/25 bg-[#0f1117] px-2.5 text-xs text-white/95 transition-colors",
  controlIdle: "hover:border-white/45 hover:bg-black/65 hover:text-white",
  controlActive: "border-white/65 bg-black/80 text-white",
  rail: "flex items-center gap-1 overflow-x-auto rounded-full border border-white/20 bg-[#0f1117] p-1",
  expandedWrap: "flex items-center gap-1 p-1",
  drawer:
    "absolute bottom-12 left-1/2 w-[min(22rem,calc(100vw-0.75rem))] -translate-x-1/2 rounded-2xl border border-white/20 bg-[#11131a]/80 p-2.5 shadow-md backdrop-blur-md md:w-[26rem]",
  searchWrap: "mb-2 flex items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-2.5 py-1.5 backdrop-blur-sm",
  actionBtn:
    "flex items-center gap-2 rounded-lg border border-white/20 bg-white/8 px-2.5 py-1.5 text-left text-sm text-white/90 backdrop-blur-sm hover:bg-white/85 hover:text-black",
  collapsedWrap: "flex items-center gap-1 p-1",
} as const;
