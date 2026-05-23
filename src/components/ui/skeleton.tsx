import { cn } from "@/utils/helpers";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-slate-800/60", className)}
      {...props}
    />
  );
}