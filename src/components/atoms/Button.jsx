import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300 hover:from-slate-200 hover:to-slate-300 hover:shadow-md hover:-translate-y-0.5",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md hover:from-accent-600 hover:to-accent-700 hover:shadow-lg hover:-translate-y-0.5",
    outline: "border-2 border-primary-600 text-primary-600 bg-transparent hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-700 hover:text-white hover:shadow-md hover:-translate-y-0.5",
    ghost: "text-slate-700 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 hover:-translate-y-0.5",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:-translate-y-0.5"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;