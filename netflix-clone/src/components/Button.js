import React from "react";

export default function Button({
  children,
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      className={`px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
