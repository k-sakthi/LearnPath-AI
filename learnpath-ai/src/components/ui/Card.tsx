import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", interactive = false, ...props }) => {
  const interactiveProps = interactive ? {
    whileHover: { y: -4, borderColor: "rgba(255,255,255,0.2)" },
    transition: { type: "spring" as const, stiffness: 300 }
  } : {};

  return (
    <motion.div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden ${className}`}
      {...interactiveProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};
