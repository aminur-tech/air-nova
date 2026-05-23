import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50",
            {
              "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:brightness-110": variant === 'primary',
              "bg-slate-800 text-white hover:bg-slate-700": variant === 'secondary',
              "border border-slate-700 text-white hover:bg-slate-800/50": variant === 'outline',
              "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20": variant === 'glass',
              "px-3 py-1.5 text-sm": size === 'sm',
              "px-5 py-2.5 text-base": size === 'md',
              "px-7 py-3.5 text-lg": size === 'lg',
            },
            className
          )
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";