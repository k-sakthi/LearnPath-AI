import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/Button";

interface NavbarProps {
  currentStep: "login" | "quiz" | "goal" | "recommend" | "progress";
}

export const Navbar: React.FC<NavbarProps> = ({ currentStep }) => {
  const { user, logout } = useAuth();

  if (currentStep === "login" || !user) return null;

  const steps = [
    { id: "quiz", label: "Quiz" },
    { id: "goal", label: "Goal" },
    { id: "recommend", label: "AI Path" },
    { id: "progress", label: "Progress" },
  ];

  const currentIdx = steps.findIndex(s => s.id === currentStep);

  return (
    <nav className="w-full bg-surface/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <span className="text-xl font-display font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            ⚡ LearnPath
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {steps.map((s, idx) => {
            const isActive = idx === currentIdx;
            const isPast = idx < currentIdx;
            
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary shadow-[0_0_8px_#6366F1]' : isPast ? 'bg-success' : 'bg-white/20'}`} />
                <span className={isActive ? 'text-white' : isPast ? 'text-gray-300' : 'text-textMuted'}>
                  {s.label}
                </span>
                {idx < steps.length - 1 && <div className="w-6 h-px bg-white/10 ml-6" />}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold">{user.displayName}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-xs border border-white/10">
            Sign out
          </Button>
        </div>

      </div>
    </nav>
  );
};
