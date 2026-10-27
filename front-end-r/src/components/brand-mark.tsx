import { cn } from "../lib/utils";

export function BrandMark({
  className,
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      src="/brand/berea-icon.svg"
      width={size}
      height={size}
      className={cn("brand-mark", className)}
      alt="Berea Church emblem"
      decoding="async"
    />
  );
}
