import * as React from "react";
import { cn } from "@/utils/helpers";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <input
          type={type}
          className={cn(
            "w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 text-white rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-500 text-sm",
            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-1 pl-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";