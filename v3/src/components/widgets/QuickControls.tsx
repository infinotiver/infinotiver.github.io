import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Card } from "./Card";

export const QuickControls = () => {
  const [soundOn, setSoundOn] = useState(true);

  return (
    <Card>
      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Controls
      </p>
      <button
        type="button"
        onClick={() => setSoundOn((v) => !v)}
        className={`flex w-fit items-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-150 ${
          soundOn
            ? "bg-foreground text-background"
            : "bg-muted/50 text-muted-foreground hover:bg-muted"
        }`}
      >
        {soundOn ? (
          <Volume2 className="h-6 w-6 shrink-0" />
        ) : (
          <VolumeX className="h-6 w-6 shrink-0" />
        )}
      </button>
    </Card>
  );
};
