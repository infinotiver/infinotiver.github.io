import UsernameChip from "./usernamechip";

export default function Hero() {
  return (
    <section className="space-y-1.5 text-left">
      <UsernameChip />
      <h2 className="text-3xl font-bold md:text-5xl">infinotiver</h2>
      

      <p className="max-w-sm text-xs text-muted-foreground md:text-sm">
        Student developer building useful full-stack products with clean UX.
      </p>
    </section>
  );
}
