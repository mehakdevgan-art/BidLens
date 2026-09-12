import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-[#B3432E] text-white",
    secondary: "border-transparent bg-[#F3EFE9] text-[#2B2523] border border-[#E5E0DA]",
    outline: "text-[#2B2523] border border-[#E5E0DA]",
    success: "border-transparent bg-emerald-100 text-emerald-800 font-medium border border-emerald-200",
    warning: "border-transparent bg-amber-100 text-amber-900 font-medium border border-amber-200",
    destructive: "border-transparent bg-red-100 text-red-800 font-medium border border-red-200",
    info: "border-transparent bg-blue-100 text-blue-800 font-medium border border-blue-200",
    maroon: "border-transparent bg-rose-100 text-[#B3432E] font-medium border border-rose-200",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#B3432E] focus:ring-offset-2",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  )
}

export { Badge }
