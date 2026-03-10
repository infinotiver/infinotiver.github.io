import React from "react";
import { siGithub } from "simple-icons";

interface QuickHubActionsProps {
  accent: string;
}

const QuickHubActions: React.FC<QuickHubActionsProps> = ({ accent }) => {
  return (
    <a
      href="https://github.com/infinotiver"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
      className="inline-flex items-center gap-1.5 px-2 py-1 text-sm font-medium transition-opacity hover:opacity-80 border-2 rounded-md"
      style={{ borderColor: accent }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
        <path d={siGithub.path} fill="currentColor" />
      </svg>
      GitHub
    </a>
  );
};

export default QuickHubActions;
