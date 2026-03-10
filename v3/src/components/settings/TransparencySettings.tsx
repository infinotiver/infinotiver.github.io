import { useTheme, type BackgroundType } from "@/hooks/useTheme";

export function TransparencySettings() {
  const { backgroundType, setBackgroundType } = useTheme();

  // Extract background style (mountain or solid) from backgroundType
  const bgStyle =
    backgroundType === "solid" || backgroundType.includes("solid")
      ? "solid"
      : "mountain";

  // Extract opacity level
  const opacityLevel =
    backgroundType === "blur-minimal"
      ? "light"
      : backgroundType === "transparent"
        ? "none"
        : "default";

  const handleBgChange = (style: "mountain" | "solid") => {
    const opacityMap = {
      default: "default",
      light: "blur-minimal",
      none: "transparent",
    };
    const newType =
      style === "solid"
        ? "solid"
        : (opacityMap[
            opacityLevel as keyof typeof opacityMap
          ] as BackgroundType);
    setBackgroundType(newType);
  };

  const handleOpacityChange = (level: "default" | "light" | "none") => {
    const opacityMap = {
      default: bgStyle === "solid" ? "solid" : "default",
      light: bgStyle === "solid" ? "solid" : ("blur-minimal" as BackgroundType),
      none: bgStyle === "solid" ? "solid" : ("transparent" as BackgroundType),
    };
    setBackgroundType(opacityMap[level] as BackgroundType);
  };

  return (
    <div className="space-y-6">
      {/* Background Style Choice */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Background</h3>
        <div className="flex gap-3">
          <button
            onClick={() => handleBgChange("mountain")}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              bgStyle === "mountain"
                ? "border-primary bg-primary/15"
                : "border-border/40 hover:border-border"
            }`}
          >
            <div className="text-sm font-medium">Mountain</div>
            <div className="text-xs text-muted-foreground">With blur</div>
          </button>

          <button
            onClick={() => handleBgChange("solid")}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              bgStyle === "solid"
                ? "border-primary bg-primary/15"
                : "border-border/40 hover:border-border"
            }`}
          >
            <div className="text-sm font-medium">Solid</div>
            <div className="text-xs text-muted-foreground">
              Light background
            </div>
          </button>
        </div>
      </div>

      {/* Opacity Level (only for mountain background) */}
      {bgStyle === "mountain" && (
        <div>
          <h3 className="mb-3 font-semibold text-foreground">Opacity</h3>
          <div className="space-y-2">
            {[
              { level: "default", label: "Default" },
              { level: "light", label: "Light" },
              { level: "none", label: "None" },
            ].map(({ level, label }) => (
              <button
                key={level}
                onClick={() =>
                  handleOpacityChange(level as "default" | "light" | "none")
                }
                className={`w-full text-left px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                  opacityLevel === level
                    ? "border-primary bg-primary/15 text-foreground font-medium"
                    : "border-border/40 text-muted-foreground hover:border-border"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
