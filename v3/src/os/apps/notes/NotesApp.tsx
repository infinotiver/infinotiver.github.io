import { useState } from "react";

const NotesApp = () => {
  const [note, setNote] = useState(() => localStorage.getItem("note") ?? "");

  const save = (value: string) => {
    setNote(value);
    localStorage.setItem("note", value);
  };

  return (
    <main className="flex h-full w-full flex-col bg-background text-foreground p-6">
      <textarea
        className="flex-1 resize-none bg-transparent text-sm outline-none placeholder-muted-foreground/50"
        placeholder="Start typing..."
        value={note}
        onChange={(e) => save(e.target.value)}
      />
    </main>
  );
};

export default NotesApp;
