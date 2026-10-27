import { BookOpen, CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <BookOpen size={26} strokeWidth={1.5} aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function LoadError({
  onRetry,
  message = "We couldn’t load this part of the library. Please try again.",
}: {
  onRetry: () => void;
  message?: string;
}) {
  return (
    <div className="load-error" role="alert">
      <CircleAlert size={20} aria-hidden="true" />
      <div>
        <h2>Let’s try that again</h2>
        <p>{message}</p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
