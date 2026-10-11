import type { ReactNode } from "react";

interface CardProps {
  className: string;
  children: ReactNode;
}

// The shell owns the card layout; the caller chooses its contents.
export default function Card({ className, children }: CardProps) {
  return <article className={className}>{children}</article>;
}
