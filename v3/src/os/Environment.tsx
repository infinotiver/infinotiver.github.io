import type { PropsWithChildren } from "react";
import Noise from "@/components/Noise";
import bg from "@/assets/assets/bg.png";

const Environment = ({ children }: PropsWithChildren) => (
  <div className="relative h-screen w-full overflow-hidden text-foreground">
    <img
      src={bg}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover grayscale blur-sm"
    />
    <div className="pointer-events-none absolute inset-0 bg-background/45" />
    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/8 via-transparent to-black/18" />

    <Noise
      patternSize={200}
      patternScaleX={2}
      patternScaleY={2}
      patternRefreshInterval={2}
      patternAlpha={15}
    />
    <div className="relative z-10 h-full overflow-y-auto px-6 py-6 pb-20 md:px-12 md:py-10 md:pb-20">
      {children}
    </div>
  </div>
);

export default Environment;
