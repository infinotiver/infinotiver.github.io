import type React from "react";
import { Folder, Github, Home, User } from "lucide-react";

interface QuickHubButtonProps {
  onOpen: () => void;
}

const quickHubIcons = [
  { Icon: Folder, className: "left-[5px] top-[5px]" },
  { Icon: User, className: "right-[5px] top-[5px]" },
  { Icon: Github, className: "bottom-[5px] left-[5px]" },
  { Icon: Home, className: "bottom-[5px] right-[5px]" },
];

const QuickHubButton: React.FC<QuickHubButtonProps> = ({ onOpen }) => {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="glass-ui relative h-11 w-11 rounded-full bg-background/60 p-1"
      aria-label="Open quick hub"
      title="Open quick hub"
    >
      {quickHubIcons.map(({ Icon, className }) => (
        <span
          key={className}
          className={`absolute ${className} rounded-full border border-border/50 bg-background/70 p-[3px]`}
        >
          <Icon className="h-2.5 w-2.5" />
        </span>
      ))}
    </button>
  );
};

export default QuickHubButton;
