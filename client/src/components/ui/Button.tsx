import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "px-4 py-2 rounded-lg font-medium transition-all";
  const variants = {
    primary: "bg-black text-white hover:bg-neutral-900",
    secondary: "bg-neutral-200 text-black hover:bg-neutral-300",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
