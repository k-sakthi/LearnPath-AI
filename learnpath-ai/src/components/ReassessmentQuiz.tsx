import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reassessmentQuestions } from "../data/questions";
import type { Topic, TopicMasteryLevel, ReassessmentHistory } from "../types";
import { generateVerdict } from "../lib/reassessmentEngine";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { BrainCircuit } from "lucide-react";

interface ReassessmentQuizProps {
  topics: Topic[];
  pendingCourseIds: string[];
  baseScores: Record<Topic, number>;
  onComplete: (historyUpdates: ReassessmentHistory[], courseIds: string[]) => void;
  onCancel: () => void;
}

export const ReassessmentQuiz: React.FC<ReassessmentQuizProps> = ({ topics, pendingCourseIds, baseScores, onComplete, onCancel }) => {
  // Aggregate questions for the targeted topics
  const questions = topics.flatMap(t => reassessmentQuestions[t] || []);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<ReassessmentHistory[]>([]);

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <h2 className="text-xl font-bold mb-4">No Quiz Available</h2>
          <p className="text-textMuted mb-6">No reassessment questions available for these topics.</p>
          <Button onClick={() => onComplete([], pendingCourseIds)}>Continue Anyway</Button>
        </Card>
      </div>
    );
  }

  const handleAnswer = (optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Score computations grouped by topic
    const topicResults: Record<Topic, { total: number; correct: number }> = {} as any;
    
    questions.forEach(q => {
      if (!topicResults[q.topic]) {
        topicResults[q.topic] = { total: 0, correct: 0 };
      }
      topicResults[q.topic].total++;
      if (answers[q.id] === q.correctAnswerIndex) {
        topicResults[q.topic].correct++;
      }
    });

    const newHistory: ReassessmentHistory[] = [];

    topics.forEach(t => {
      if (!topicResults[t]) return;
      const newScore = (topicResults[t].correct / topicResults[t].total) * 100;
      const base = baseScores[t] || 0;
      const { verdict, explanation } = generateVerdict(base, newScore);

      newHistory.push({
        id: Math.random().toString(36).substring(7),
        topic: t,
        timestamp: Date.now(),
        previousScore: base,
        newScore,
        skillLevelVerdict: verdict,
        explanation
      });
    });

    setResults(newHistory);
    setIsFinished(true);
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl">
          <Card className="p-8 border-primary/30">
            <h2 className="text-2xl font-bold mb-6 text-center">Reassessment Results</h2>
            <div className="space-y-4 mb-8">
              {results.map(r => (
                <div key={r.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="topic">{r.topic}</Badge>
                    <Badge colorStr={r.skillLevelVerdict === "Mastered" ? "green" : r.skillLevelVerdict === "Weak" ? "red" : "amber"}>{r.skillLevelVerdict}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-textMuted mb-3">
                    <span>Base Score: {Math.round(r.previousScore)}%</span>
                    <span>→</span>
                    <span className="text-primary font-bold">New Score: {Math.round(r.newScore)}%</span>
                  </div>
                  <p className="text-sm italic text-gray-300">"{r.explanation}"</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button size="lg" onClick={() => onComplete(results, pendingCourseIds)}>Update Priorities & Continue</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-xl">
        <Card className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center text-primary">
              <BrainCircuit size={20} />
              <span className="font-semibold text-sm">Quick Reassessment</span>
            </div>
            <div className="text-textMuted text-sm font-medium">Question {currentIndex + 1} of {questions.length}</div>
          </div>
          
          <div className="mb-4">
            <Badge variant="topic" className="mb-3">{currentQ.topic}</Badge>
            <h3 className="text-xl font-medium leading-relaxed">{currentQ.text}</h3>
          </div>

          <div className="space-y-3 mt-6">
            {currentQ.options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${answers[currentQ.id] === i ? 'bg-primary/20 border-primary' : 'bg-transparent border-white/10 hover:border-white/30 hover:bg-white/5'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button 
              disabled={answers[currentQ.id] === undefined}
              onClick={handleNext}
            >
              {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
