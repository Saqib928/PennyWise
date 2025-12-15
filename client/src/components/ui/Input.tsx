import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-black ${className}`}
        {...props}
      />
    );
  }
);
