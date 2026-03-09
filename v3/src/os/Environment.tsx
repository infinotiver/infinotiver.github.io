import type { PropsWithChildren } from "react";
import Noise from "@/components/Noise";

const Environment = ({ children }: PropsWithChildren) => (
  <div className="relative h-screen w-full overflow-hidden bg-linear-to-br from-background via-background to-secondary/30 text-foreground">
    <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

    <Noise
      patternSize={200}
      patternScaleX={2}
      patternScaleY={2}
      patternRefreshInterval={2}
      patternAlpha={15}
    />
    <div className="relative z-10 h-full overflow-y-auto px-4 py-5 pb-24 md:px-10 md:py-8 md:pb-24">
      {children}
    </div>
  </div>
);

export default Environment;
