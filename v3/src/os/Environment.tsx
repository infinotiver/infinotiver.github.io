import type { PropsWithChildren } from "react";
import Noise from "@/components/Noise";
import { useTheme } from "@/hooks/useTheme";
import bg from "@/assets/assets/bg.png";

const Environment = ({ children }: PropsWithChildren) => {
  const { backgroundType } = useTheme();

  const isSolid = backgroundType === "solid";
  const bgOverlay = {
    default: "bg-background/45",
    "blur-minimal": "bg-background/25",
    solid: "bg-background/80",
    transparent: "bg-transparent",
  }[backgroundType];

  return (
    <div className="relative h-screen w-full overflow-hidden text-foreground">
      {/* Background image (hidden when solid) */}
      {!isSolid && (
        <img
          src={bg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover grayscale blur-sm"
        />
      )}

      {/* Background overlay */}
      {isSolid ? (
        <div className="pointer-events-none absolute inset-0 bg-slate-100" />
      ) : (
        <div className={`pointer-events-none absolute inset-0 ${bgOverlay}`} />
      )}

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/8 via-transparent to-black/18" />

      <Noise
        patternSize={200}
        patternScaleX={2}
        patternScaleY={2}
        patternRefreshInterval={2}
        patternAlpha={15}
      />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
};

export default Environment;
