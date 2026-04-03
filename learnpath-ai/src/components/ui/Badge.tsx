import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "topic" | "level" | "priority" | "default";
  colorStr?: string; // specific color override like 'indigo', 'amber'
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", colorStr, className = "" }) => {
  let styles = "px-2.5 py-1 text-xs font-semibold rounded-full border ";

  if (colorStr === "green") {
    styles += "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (colorStr === "amber") {
    styles += "bg-amber-500/10 text-amber-400 border-amber-500/20";
  } else if (colorStr === "red") {
    styles += "bg-rose-500/10 text-rose-400 border-rose-500/20";
  } else if (colorStr === "blue") {
    styles += "bg-sky-500/10 text-sky-400 border-sky-500/20";
  } else if (variant === "topic") {
    styles += "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
  } else if (variant === "priority") {
    styles += "bg-rose-500/10 text-rose-400 border-rose-500/20";
  } else {
    // default
    styles += "bg-white/5 text-textMuted border-white/10";
  }

  return <span className={`${styles} ${className}`}>{children}</span>;
};
