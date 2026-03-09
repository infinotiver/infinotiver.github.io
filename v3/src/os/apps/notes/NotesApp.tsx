import type { AppProps } from "@/os/apps/types";

const NotesApp = (_props: AppProps) => {
  return (
    <main className="space-y-3">
      <h2 className="text-3xl font-bold md:text-5xl">Notes</h2>
      <p className="max-w-xl text-sm text-muted-foreground md:text-base">
        This is a placeholder app for your desktop environment. Replace with
        your notes or utility app.
      </p>
    </main>
  );
};

export default NotesApp;
