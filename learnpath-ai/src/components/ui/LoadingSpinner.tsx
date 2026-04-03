import React from "react";
import { motion } from "framer-motion";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="w-16 h-16 rounded-full border-4 border-white/5 border-t-primary shadow-[0_0_30px_rgba(99,102,241,0.3)] filter drop-shadow-lg relative animate-pulseGlow"
      >
        <div className="absolute inset-2 rounded-full border-4 border-white/5 border-r-secondary" />
      </motion.div>
    </div>
  );
};
