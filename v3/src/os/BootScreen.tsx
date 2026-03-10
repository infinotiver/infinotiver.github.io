import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BootScreenProps {
  onBootComplete: () => void;
}

export const BootScreen = ({ onBootComplete }: BootScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const bootSequence = async () => {
      // Simulate boot sequence: 0 -> 100% over 4 seconds
      const steps = 20;
      const stepDuration = 200; 

      for (let i = 0; i <= steps; i++) {
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
        setProgress((i / steps) * 100);
      }

      // Wait a bit longer before transitioning
      await new Promise((resolve) => setTimeout(resolve, 400));
      onBootComplete();
    };

    bootSequence();
  }, [onBootComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      {/* Logo/Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-black tracking-tighter text-foreground md:text-7xl">
          karretOS
        </h1>
       
      </motion.div>

      {/* Progress bar */}
      <div className="w-64 space-y-3">
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-linear-to-r from-foreground to-foreground/60"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        <p className="text-right text-xs font-mono text-muted-foreground">
          {Math.round(progress)}%
        </p>
      </div>

    </motion.div>
  );
};
