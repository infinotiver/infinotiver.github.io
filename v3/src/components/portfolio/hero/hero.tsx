import { useState } from "react";
import UsernameChip, { identities, type ChipIdentity } from "./usernamechip";
import QuickHubActions from "./quickhubactions";

export default function Hero() {
  const [activeIdentity, setActiveIdentity] = useState<ChipIdentity>(
    identities[0],
  );

  return (
    <section className="space-y-2 text-left">
      <UsernameChip onActiveIdentityChange={setActiveIdentity} />
      <h2 className="text-3xl font-bold md:text-5xl">infinotiver</h2>
      <p className="max-w-sm text-xs text-muted-foreground md:text-sm">
        Student developer building useful full-stack products with clean UX.I
        like to imagine stuff and try to build it — even when it fails
      </p>

      <QuickHubActions accent={activeIdentity.accent} />
    </section>
  );
}
