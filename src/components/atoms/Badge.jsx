import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm",
    info: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm",
    outline: "border border-slate-300 text-slate-700 bg-transparent"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;