import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  
  const variants = {
    default: "bg-[#B3432E] text-white hover:bg-[#9E3824] shadow-sm active:scale-[0.98]",
    secondary: "bg-[#F3EFE9] text-[#2B2523] hover:bg-[#EAE4DC] border border-[#E5E0DA]",
    outline: "border border-[#E5E0DA] bg-white hover:bg-[#FAF8F5] text-[#2B2523]",
    ghost: "hover:bg-[#F3EFE9] text-[#2B2523]",
    destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    link: "text-[#B3432E] underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-9 px-4 py-2 text-sm font-medium rounded-lg",
    sm: "h-8 px-3 text-xs font-medium rounded-md",
    lg: "h-10 px-6 text-base font-medium rounded-lg",
    icon: "h-9 w-9 p-0 rounded-lg flex items-center justify-center",
  }

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B3432E] disabled:pointer-events-none disabled:opacity-50",
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
