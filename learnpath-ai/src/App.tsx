import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoginPage } from "./components/LoginPage";
import { Quiz } from "./components/Quiz";
import { GoalSetter } from "./components/GoalSetter";
import { Recommend } from "./components/Recommend";
import { Progress } from "./components/Progress";
import { Navbar } from "./components/Navbar";
import { useAuth } from "./hooks/useAuth";
import { db } from "./firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import type { Path, Goal, Topic } from "./types";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

type Step = "login" | "quiz" | "goal" | "recommend" | "progress";

function App() {
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("login");
  const [skillScores, setSkillScores] = useState<Record<Topic, number>>({} as any);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [path, setPath] = useState<Path | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setCurrentStep("login");
      setIsInitializing(false);
      return;
    }

    // Check if user already has a generated path
    const checkUserPath = async () => {
      try {
        const pathDoc = await getDoc(doc(db, "paths", user.uid));
        if (pathDoc.exists()) {
          setPath(pathDoc.data() as Path);
          setCurrentStep("progress");
        } else {
          setCurrentStep("quiz");
        }
      } catch (err) {
        console.error("Error checking path", err);
        setCurrentStep("quiz");
      }
      setIsInitializing(false);
    };

    checkUserPath();
  }, [user, loading]);

  const handleQuizComplete = (scores: Record<Topic, number>) => {
    setSkillScores(scores);
    setCurrentStep("goal");
  };

  const handleGoalComplete = (selectedGoal: Goal) => {
    setGoal(selectedGoal);
    setCurrentStep("recommend");
  };

  const handlePathComplete = (generatedPath: Path) => {
    setPath(generatedPath);
    setCurrentStep("progress");
  };

  const handleNewGoal = async () => {
    if (user?.uid) {
      try {
        await deleteDoc(doc(db, "paths", user.uid));
        await deleteDoc(doc(db, "progress", user.uid));
      } catch (err) {
        console.error("Failed to delete user paths from db:", err);
      }
    }
    setPath(null);
    setGoal(null);
    setCurrentStep("goal");
  };

  if (loading || isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-textPrimary selection:bg-primary/30 flex flex-col">
      <Navbar currentStep={currentStep} />
      
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          {currentStep === "login" && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
              <LoginPage onNext={() => setCurrentStep("quiz")} />
            </motion.div>
          )}

          {currentStep === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Quiz onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {currentStep === "goal" && (
            <motion.div key="goal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <GoalSetter onComplete={handleGoalComplete} />
            </motion.div>
          )}

          {currentStep === "recommend" && goal && (
            <motion.div key="recommend" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }}>
              <Recommend goal={goal} skillScores={skillScores} onComplete={handlePathComplete} />
            </motion.div>
          )}

          {currentStep === "progress" && (
            <motion.div key="progress" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Progress path={path} onNewGoal={handleNewGoal} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
