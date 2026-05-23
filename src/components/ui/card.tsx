import * as React from "react";
import { cn } from "@/utils/helpers";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl text-white shadow-xl", className)}
      {...props}
    />
  );
}