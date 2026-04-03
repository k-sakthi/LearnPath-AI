import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { ProgressBar } from "./ui/ProgressBar";
import type { Topic } from "../types";

const questions = [
  // DSA
  { id: 1, topic: "DSA" as Topic, text: "What is the time complexity of binary search?", options: [{ id: "A", text: "O(n)" }, { id: "B", text: "O(log n)", correct: true }, { id: "C", text: "O(n²)" }, { id: "D", text: "O(1)" }] },
  { id: 2, topic: "DSA" as Topic, text: "Which data structure uses LIFO order?", options: [{ id: "A", text: "Queue" }, { id: "B", text: "Array" }, { id: "C", text: "Stack", correct: true }, { id: "D", text: "Linked List" }] },
  { id: 3, topic: "DSA" as Topic, text: "What is the worst case of QuickSort?", options: [{ id: "A", text: "O(n log n)" }, { id: "B", text: "O(n)" }, { id: "C", text: "O(n²)", correct: true }, { id: "D", text: "O(log n)" }] },

  // Algorithms
  { id: 4, topic: "Algorithms" as Topic, text: "Which algorithm finds shortest path in weighted graph?", options: [{ id: "A", text: "BFS" }, { id: "B", text: "DFS" }, { id: "C", text: "Dijkstra", correct: true }, { id: "D", text: "Prim's" }] },
  { id: 5, topic: "Algorithms" as Topic, text: "Dynamic programming solves problems by...", options: [{ id: "A", text: "Brute force" }, { id: "B", text: "Memoization", correct: true }, { id: "C", text: "Recursion only" }, { id: "D", text: "Greedy" }] },
  { id: 6, topic: "Algorithms" as Topic, text: "Merge sort time complexity?", options: [{ id: "A", text: "O(n²)" }, { id: "B", text: "O(n log n)", correct: true }, { id: "C", text: "O(log n)" }, { id: "D", text: "O(n)" }] },

  // OS
  { id: 7, topic: "OS" as Topic, text: "What is a deadlock?", options: [{ id: "A", text: "Memory leak" }, { id: "B", text: "Circular wait for resources", correct: true }, { id: "C", text: "Slow process" }, { id: "D", text: "Crash" }] },
  { id: 8, topic: "OS" as Topic, text: "Which scheduling is non-preemptive?", options: [{ id: "A", text: "Round Robin" }, { id: "B", text: "FCFS", correct: true }, { id: "C", text: "SRTF" }, { id: "D", text: "Priority" }] },
  { id: 9, topic: "OS" as Topic, text: "Page fault occurs when...", options: [{ id: "A", text: "CPU overloads" }, { id: "B", text: "Disk is full" }, { id: "C", text: "Page not in RAM", correct: true }, { id: "D", text: "RAM is full" }] },

  // DBMS
  { id: 10, topic: "DBMS" as Topic, text: "ACID stands for?", options: [{ id: "A", text: "Atomic Consistent Isolated Durable", correct: true }, { id: "B", text: "Array Cache Index Data" }, { id: "C", text: "Advanced Coding" }, { id: "D", text: "None" }] },
  { id: 11, topic: "DBMS" as Topic, text: "Which SQL joins return all rows from both tables?", options: [{ id: "A", text: "INNER" }, { id: "B", text: "LEFT" }, { id: "C", text: "FULL OUTER", correct: true }, { id: "D", text: "RIGHT" }] },
  { id: 12, topic: "DBMS" as Topic, text: "3NF removes...", options: [{ id: "A", text: "Primary keys" }, { id: "B", text: "Transitive dependencies", correct: true }, { id: "C", text: "Foreign keys" }, { id: "D", text: "Indexes" }] },

  // Math
  { id: 13, topic: "Math" as Topic, text: "What is the derivative of x²?", options: [{ id: "A", text: "x" }, { id: "B", text: "2x", correct: true }, { id: "C", text: "x³" }, { id: "D", text: "2" }] },
  { id: 14, topic: "Math" as Topic, text: "P(A∪B) formula?", options: [{ id: "A", text: "P(A)+P(B)" }, { id: "B", text: "P(A)×P(B)" }, { id: "C", text: "P(A)+P(B)-P(A∩B)", correct: true }, { id: "D", text: "None" }] },
  { id: 15, topic: "Math" as Topic, text: "Eigenvalue means Ax = ?", options: [{ id: "A", text: "0" }, { id: "B", text: "Ax" }, { id: "C", text: "λx", correct: true }, { id: "D", text: "x+1" }] }
];

interface QuizProps {
  onComplete: (scores: Record<Topic, number>) => void;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const question = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  const handleSelect = (optionId: string, isCorrect: boolean) => {
    if (selectedOption) return; // Prevent double click
    
    setSelectedOption(optionId);
    setAnswers(prev => ({ ...prev, [question.id]: isCorrect }));

    setTimeout(() => {
      setSelectedOption(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
      } else {
        setIsFinished(true);
      }
    }, 500);
  };

  const calculateScores = () => {
    const scores: Record<string, { total: number; correct: number }> = {};
    
    questions.forEach(q => {
      if (!scores[q.topic]) scores[q.topic] = { total: 0, correct: 0 };
      scores[q.topic].total += 1;
      if (answers[q.id]) scores[q.topic].correct += 1;
    });

    const finalScores: Record<Topic, number> = {} as Record<Topic, number>;
    Object.entries(scores).forEach(([topic, data]) => {
      finalScores[topic as Topic] = Math.round((data.correct / data.total) * 100);
    });

    return finalScores;
  };

  if (isFinished) {
    const scores = calculateScores();
    const chartData = Object.entries(scores).map(([subject, A]) => ({ subject, A, fullMark: 100 }));
    
    const strengths = Object.entries(scores).filter(([_, s]) => s >= 70).map(([t]) => t);
    const needsWork = Object.entries(scores).filter(([_, s]) => s < 40).map(([t]) => t);

    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="p-8">
            <h2 className="text-3xl font-display font-bold text-center mb-8">Skill Assessment Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                    <Radar name="Score" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-emerald-400">Your Strengths</h3>
                  <div className="flex gap-2 flex-wrap">
                    {strengths.length ? strengths.map(s => <Badge key={s} colorStr="green">{s}</Badge>) : <span className="text-textMuted">None yet, but you'll get there!</span>}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-rose-400">Needs Work</h3>
                  <div className="flex gap-2 flex-wrap">
                    {needsWork.length ? needsWork.map(s => <Badge key={s} colorStr="red">{s}</Badge>) : <span className="text-textMuted">Looks solid!</span>}
                  </div>
                </div>

                <div className="pt-6">
                  <Button variant="gradient" size="lg" className="w-full" onClick={() => onComplete(scores)}>
                    Set My Goal &rarr;
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-20 px-4 min-h-screen flex flex-col justify-center">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 text-textMuted font-medium text-sm">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <Badge variant="topic" className="capitalize">{question.topic}</Badge>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-display font-medium leading-relaxed mb-8">
              {question.text}
            </h2>
            <div className="space-y-4">
              {question.options.map(opt => {
                const isSelected = selectedOption === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: selectedOption ? 1 : 1.02 }}
                    whileTap={{ scale: selectedOption ? 1 : 0.98 }}
                    onClick={() => handleSelect(opt.id, !!opt.correct)}
                    className={`w-full text-left p-5 rounded-xl border transition-all duration-200 text-lg flex items-center justify-between
                      ${isSelected 
                        ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(99,102,241,0.2)] text-white" 
                        : "bg-surface border-border hover:border-primary/50 hover:bg-white/5"}`}
                  >
                    <span><span className="text-textMuted mr-4 font-mono">{opt.id}</span> {opt.text}</span>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
