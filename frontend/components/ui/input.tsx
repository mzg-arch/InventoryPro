import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-border-strong bg-surface-raised px-3 py-1.5 text-base text-text-primary shadow-xs transition-[background-color,border-color,box-shadow] duration-150 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted hover:border-subtle-accent hover:bg-surface-primary focus-visible:border-subtle-accent focus-visible:bg-surface-primary focus-visible:ring-2 focus-visible:ring-subtle-accent/20 disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:text-text-muted aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
