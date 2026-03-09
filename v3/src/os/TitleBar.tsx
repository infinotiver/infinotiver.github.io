import { Maximize2, Minimize2, X } from "lucide-react";
import type { WindowState } from "@/os/useSession";

interface TitleBarProps {
  title: string;
  windowState: WindowState;
  onToggleMaximize: () => void;
  onClose: () => void;
}

const ctrl =
  "inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-900 transition-colors hover:bg-black/10";

const TitleBar = ({
  title,
  windowState,
  onToggleMaximize,
  onClose,
}: TitleBarProps) => (
  <header className="flex items-center justify-between px-4 pt-3 pb-3 cursor-grab active:cursor-grabbing">
    {/* spacer — draggable area */}
    <div className="flex-1" />

    <div className="flex items-center gap-1.5 rounded-lg bg-gray-400/25 px-2 py-1">
      <p className="mr-1 select-none text-sm font-semibold text-muted-foreground">
        {title}
      </p>

      <button
        type="button"
        onClick={onToggleMaximize}
        onPointerDown={(e) => e.stopPropagation()}
        className={ctrl}
        aria-label={windowState === "maximized" ? "Restore" : "Maximize"}
      >
        {windowState === "maximized" ? (
          <Minimize2 className="h-3.5 w-3.5" />
        ) : (
          <Maximize2 className="h-3.5 w-3.5" />
        )}
      </button>
      <button
        type="button"
        onClick={onClose}
        onPointerDown={(e) => e.stopPropagation()}
        className={`${ctrl} hover:!bg-red-500/20 hover:!text-red-600`}
        aria-label={`Close ${title}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  </header>
);

export default TitleBar;
