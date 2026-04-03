import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import type { Goal } from "../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";

const goalsList = [
  { id: "gate", title: "🎓 Crack GATE Exam", subtext: "Master CS fundamentals for GATE rank" },
  { id: "faang", title: "💼 Land a FAANG Job", subtext: "Ace DSA + system design interviews" },
  { id: "webdev", title: "🌐 Become a Web Developer", subtext: "Build real-world fullstack projects" },
  { id: "research", title: "🔬 Research & Higher Studies", subtext: "Deep CS theory for MS/PhD" },
  { id: "ml", title: "🤖 Master Machine Learning", subtext: "Build intelligent systems with ML & AI" },
  { id: "competitive", title: "🏆 Competitive Programming", subtext: "Crack Codeforces, LeetCode & contests" },
  { id: "devops", title: "⚙️ DevOps & Cloud Engineering", subtext: "CI/CD, Docker, Kubernetes & AWS" },
  { id: "mobile", title: "📱 Mobile App Development", subtext: "Build iOS & Android apps" },
  { id: "general", title: "🚀 General Skill Building", subtext: "Explore and grow at your pace" },
];

const timelines = ["1 month", "3 months", "6 months"];

interface GoalSetterProps {
  onComplete: (goal: Goal) => void;
}

export const GoalSetter: React.FC<GoalSetterProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState<string>("faang");
  const [hours, setHours] = useState(10);
  const [timeline, setTimeline] = useState("3 months");
  const [focus, setFocus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    setIsSaving(true);
    const currentGoal: Goal = {
      type: goalsList.find(g => g.id === selectedGoal)?.title || "General",
      hoursPerWeek: hours,
      timeline,
      focusAreas: focus
    };

    if (user?.uid) {
      await setDoc(doc(db, "users", user.uid), {
        goal: currentGoal,
        displayName: user.displayName,
        email: user.email,
        createdAt: Date.now()
      }, { merge: true });
    }
    
    setIsSaving(false);
    onComplete(currentGoal);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent mb-4"
        >
          What's your learning mission?
        </motion.h1>
        <p className="text-textMuted text-lg">Define your target, and our AI will build the path.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {goalsList.map(g => {
          const isSelected = selectedGoal === g.id;
          return (
            <motion.div
              key={g.id}
              whileHover={{ scale: isSelected ? 1 : 1.02 }}
              whileTap={{ scale: isSelected ? 1 : 0.98 }}
              className="cursor-pointer h-full"
              onClick={() => setSelectedGoal(g.id)}
            >
              <Card className={`p-6 h-full transition-all duration-300 relative ${isSelected ? "border-primary shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-primary/10" : "hover:border-primary/50"}`}>
                {isSelected && (
                  <div className="absolute top-4 right-4 text-primary">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{g.title}</h3>
                <p className="text-textMuted">{g.subtext}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="p-8 mb-12">
        <div className="space-y-10">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-semibold">Hours per week</label>
              <span className="text-2xl font-bold text-primary">{hours} <span className="text-sm font-normal text-textMuted">hrs</span></span>
            </div>
            <input 
              type="range" 
              min="1" max="40" 
              value={hours} 
              onChange={e => setHours(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-4">Timeline</label>
            <div className="flex gap-4 flex-wrap">
              {timelines.map(t => (
                <button
                  key={t}
                  onClick={() => setTimeline(t)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${timeline === t ? "bg-primary text-white shadow-lg" : "bg-white/5 text-textPrimary hover:bg-white/10"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold mb-4">Any specific focus areas? (Optional)</label>
            <input 
              type="text" 
              value={focus}
              onChange={e => setFocus(e.target.value)}
              placeholder="e.g. System Design, React Native, SQL..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white placeholder-textMuted"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button 
          variant="gradient" 
          size="lg" 
          onClick={handleGenerate} 
          isLoading={isSaving}
          className="px-12 text-lg shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)]"
        >
          Generate My AI Path &rarr;
        </Button>
      </div>
    </div>
  );
};
