import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import "./index.css";
import "./globals.css";
import { BootScreen } from "@/os/BootScreen";
import Shell from "@/os/Shell";

const App = () => {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!bootComplete ? (
        <BootScreen key="boot" onBootComplete={() => setBootComplete(true)} />
      ) : (
        <Shell key="shell" />
      )}
    </AnimatePresence>
  );
};

export default App;
