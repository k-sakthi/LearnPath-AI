import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = "" }) => {
  return (
    <div className={`w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] relative"
      >
        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
      </motion.div>
    </div>
  );
};
