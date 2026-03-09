interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm ${className}`}
  >
    {children}
  </div>
);
