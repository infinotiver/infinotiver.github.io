import type { AppDefinition, AppId } from "@/os/apps/types";

interface AppGridProps {
  apps: AppDefinition[];
  selectedId: AppId | null;
  onSelect: (id: AppId) => void;
  onOpen: (id: AppId) => void;
}

const AppGrid = ({ apps, selectedId, onSelect, onOpen }: AppGridProps) => (
  <section className="relative z-20">
    <div className="flex flex-wrap gap-5">
      {apps.map((app) => {
        const Icon = app.icon;
        const isSelected = selectedId === app.id;
        return (
          <button
            key={app.id}
            type="button"
            onClick={() => onSelect(app.id)}
            onDoubleClick={() => onOpen(app.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onOpen(app.id);
            }}
            className="group flex w-20 flex-col items-center gap-2"
            title={`${app.title} — double-click to open`}
          >
            <span
              className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200 group-hover:scale-105 group-hover:shadow-md ${
                isSelected
                  ? "bg-primary/15 ring-2 ring-primary/40 shadow-primary/10"
                  : "bg-muted/70 group-hover:bg-primary/10"
              }`}
            >
              <Icon
                className={`h-7 w-7 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
              />
            </span>
            <p
              className={`w-full truncate text-center text-xs font-semibold leading-tight ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
            >
              {app.title}
            </p>
          </button>
        );
      })}
    </div>
  </section>
);

export default AppGrid;
