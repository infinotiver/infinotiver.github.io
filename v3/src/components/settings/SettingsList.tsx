interface SettingsListProps {
  settings: Array<{ icon: string; title: string; description: string }>;
  active: string;
  onSelect: (title: string) => void;
}

export function SettingsList({
  settings,
  active,
  onSelect,
}: SettingsListProps) {
  return (
    <aside className="w-48 shrink-0 border-r border-border overflow-y-auto p-2 flex flex-col gap-1">
      {settings.map(({ icon, title }) => (
        <button
          key={title}
          onClick={() => onSelect(title)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors ${
            active === title
              ? "bg-primary/20 text-foreground border border-primary"
              : "text-muted-foreground hover:bg-muted/50"
          }`}
        >
          <span>{icon}</span>
          {title}
        </button>
      ))}
    </aside>
  );
}
