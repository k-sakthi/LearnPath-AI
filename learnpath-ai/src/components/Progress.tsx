import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Trophy, Sparkles, CheckCircle2, Plus } from "lucide-react";
import type { Path, Topic, ReassessmentHistory } from "../types";
import { courses } from "../data/courses";
import { useProgress } from "../hooks/useProgress";
import { useAuth } from "../hooks/useAuth";
import { ReassessmentQuiz } from "./ReassessmentQuiz";
import { getPriorityFromVerdict } from "../lib/reassessmentEngine";
import { openResource } from "../lib/urlHelper";

interface ProgressProps {
  path: Path | null;
  onNewGoal?: () => void;
}

const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

export const Progress: React.FC<ProgressProps> = ({ path, onNewGoal }) => {
  const { user } = useAuth();
  const { progress, toggleCourse, validateCourses } = useProgress(user?.uid);
  const [isManuallyCompleted, setIsManuallyCompleted] = useState(false);
  
  const [history, setHistory] = useState<ReassessmentHistory[]>([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    try {
      if (user?.uid) {
        const stored = localStorage.getItem(`reassessment_${user.uid}`);
        if (stored) setHistory(JSON.parse(stored));
      }
    } catch (e) {}
  }, [user?.uid]);

  const handleQuizComplete = (updates: ReassessmentHistory[], courseIds: string[]) => {
    const newHistory = [...updates, ...history];
    setHistory(newHistory);
    if (user?.uid) {
      localStorage.setItem(`reassessment_${user.uid}`, JSON.stringify(newHistory));
    }
    validateCourses(courseIds);
    setIsQuizOpen(false);
  };

  if (!path) return <div className="p-8 text-center mt-20">Path not found. Please set a goal first.</div>;

  const totalCourses = path.path.length;
  const completedCount = progress.completedCourses.length;
  const progressPercent = Math.round((completedCount / totalCourses) * 100) || 0;
  const isCompleted = progressPercent >= 100 || isManuallyCompleted;

  if (isCompleted) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 px-4 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full w-40 h-40 left-1/2 -translate-x-1/2" />
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.5)] border-4 border-background relative z-10 mx-auto">
            <Trophy size={60} className="text-white" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-0 flex items-center justify-center opacity-50"
          >
            <Sparkles size={160} className="text-yellow-400/30" />
          </motion.div>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-display font-bold mb-4 text-center bg-gradient-to-r from-primary via-purple-400 to-cyan-300 bg-clip-text text-transparent"
        >
          Goal Accomplished!
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="text-textMuted text-lg mb-10 text-center max-w-xl mx-auto leading-relaxed"
        >
          Incredible work! You've successfully completed your learning path. The skills you've acquired will serve as a powerful foundation for your future endeavors.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button size="lg" variant="gradient" className="gap-2 px-8 py-4 text-base" onClick={onNewGoal}>
            <Plus size={20} />
            Set New Goal
          </Button>
        </motion.div>
      </div>
    );
  }

  const totalHours = path.path
    .filter(p => progress.completedCourses.includes(p.courseId))
    .reduce((sum, p) => sum + (p.estimatedHours || 0), 0);

  const topicsDist: Record<string, number> = {};
  path.path.forEach(p => {
    if (progress.completedCourses.includes(p.courseId)) {
      const course = courses.find(c => c.id === p.courseId);
      if (course) {
        topicsDist[course.topic] = (topicsDist[course.topic] || 0) + 1;
      }
    }
  });

  const chartData = Object.entries(topicsDist).map(([name, value]) => ({ name, value }));

  const getMessage = () => {
    if (progressPercent === 0) return "Great start! Ready to dive in?";
    if (progressPercent < 25) return "Building momentum! Keep it up.";
    if (progressPercent < 50) return "Solid progress! You're getting there.";
    if (progressPercent < 75) return "More than halfway! The finish line is near.";
    if (progressPercent < 100) return "Almost there! Just a bit more.";
    return "🎉 Mission Complete! You did it!";
  };

  const pendingTopics = Array.from(new Set(
    (progress.pendingCourses || []).map(id => courses.find(c => c.id === id)?.topic).filter(Boolean) as Topic[]
  ));

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 relative">
      <AnimatePresence>
        {isQuizOpen && (
          <ReassessmentQuiz 
            topics={pendingTopics} 
            pendingCourseIds={progress.pendingCourses || []} 
            baseScores={{} as Record<Topic, number>}
            onComplete={handleQuizComplete} 
            onCancel={() => setIsQuizOpen(false)} 
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Validated", val: `${completedCount} / ${totalCourses}`, icon: "📘" },
          { label: "Hours Invested", val: `${totalHours}h`, icon: "⏱️" },
          { label: "Pending Reassessment", val: `${progress.pendingCourses?.length || 0}`, icon: "⏳" },
          { label: "Overall Mastery", val: `${progressPercent}%`, icon: "🚀" }
        ].map((stat, i) => (
          <Card key={i} className="p-6 flex items-center justify-between">
            <div>
              <p className="text-textMuted text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.val}</p>
            </div>
            <div className="text-3xl opacity-80">{stat.icon}</div>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {progress.pendingCourses && progress.pendingCourses.length > 0 && !isQuizOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-8 relative z-10">
            <Card className="p-5 border-amber-500/50 bg-amber-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-amber-500 mb-1">Validation Required</h3>
                <p className="text-sm text-amber-200/80">You've marked topics as pending. Complete a quick reassessment to validate mastery and adapt your path.</p>
              </div>
              <Button className="shrink-0 bg-amber-500 hover:bg-amber-600 text-black font-bold" onClick={() => setIsQuizOpen(true)}>
                Take Quick Reassessment
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-2xl font-bold mb-6">Course Checklist</h2>
          
          {path.path.map((item) => {
            const course = courses.find(c => c.id === item.courseId);
            if (!course) return null;
            
            const isCompleted = progress.completedCourses.includes(item.courseId);
            const isPending = progress.pendingCourses?.includes(item.courseId);

            let displayPriority: string = item.priority;
            let verdictBadge = null;
            const recentTopicHistory = history.find(h => h.topic === course.topic);
            
            if (recentTopicHistory) {
               displayPriority = getPriorityFromVerdict(recentTopicHistory.skillLevelVerdict).toLowerCase() as any;
               verdictBadge = recentTopicHistory.skillLevelVerdict;
            }

            return (
              <Card key={item.courseId} className={`p-5 transition-all duration-300 ${isCompleted ? 'opacity-60 grayscale-[0.3]' : 'hover:border-white/20'}`}>
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => toggleCourse(item.courseId)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      isCompleted ? 'bg-success border-success' : 
                      isPending ? 'bg-amber-500 border-amber-500' : 'border-white/20 hover:border-primary'
                    }`}
                  >
                    {(isCompleted || isPending) && (
                      <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-textMuted' : ''}`}>
                      {course.title}
                    </h3>
                    <div className="flex gap-2 mt-2 items-center flex-wrap">
                      <Badge variant="priority" colorStr={displayPriority === 'critical' || displayPriority === 'high' ? 'red' : displayPriority === 'recommended' || displayPriority === 'medium' ? 'amber' : 'blue'}>
                        {displayPriority.toUpperCase()} PRIORITY
                      </Badge>
                      <Badge variant="topic">{course.topic}</Badge>
                      
                      {isCompleted ? (
                        <Badge colorStr="green">Validated ✓</Badge>
                      ) : isPending ? (
                        <Badge colorStr="amber">Pending Validation ⌛</Badge>
                      ) : (
                        <span className="text-xs text-primary">{course.duration_hours}h</span>
                      )}

                      {verdictBadge && <Badge colorStr={verdictBadge === "Mastered" ? "green" : verdictBadge === "Weak" ? "red" : "blue"}>{verdictBadge}</Badge>}
                    </div>
                  </div>

                  {!isCompleted && !isPending && (
                    <Button variant="ghost" size="sm" onClick={() => openResource(course.resourceUrl)}>
                      Start
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 text-center h-full flex flex-col">
            <h3 className="text-xl font-bold mb-2">Topic Mastery</h3>
            <p className="text-textMuted text-sm mb-6">Distribution of completed courses</p>
            
            {chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#12121A', borderColor: '#1E1E2E' }} itemStyle={{ color: '#F1F5F9' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-3 flex-wrap mt-4">
                  {chartData.map((entry, i) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-textMuted">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      {entry.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                <p className="text-textMuted">Complete courses to unlock mastery chart</p>
              </div>
            )}

            {history.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10 text-left">
                 <h3 className="font-bold mb-4">Adaptive Insights</h3>
                 <div className="space-y-3">
                   {history.slice(0, 3).map(h => (
                     <div key={h.id} className="p-3 bg-white/5 rounded-lg border border-white/10 text-sm">
                       <div className="flex gap-2 items-center mb-1"><Badge variant="topic">{h.topic}</Badge><span className={`font-semibold ${h.skillLevelVerdict === 'Weak' ? 'text-red-400' : 'text-green-400'}`}>{h.skillLevelVerdict} Trend</span></div>
                       <p className="text-textMuted text-xs">{h.explanation}</p>
                     </div>
                   ))}
                 </div>
              </div>
            )}

            <div className="mt-auto pt-8 border-t border-white/10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
              <div className="text-left">
                <h3 className="font-bold mb-3">Journey Status</h3>
                <p className="text-lg text-primary">{getMessage()}</p>
              </div>
              {progressPercent < 100 && (
                <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10 gap-2 shrink-0" onClick={() => setIsManuallyCompleted(true)}>
                  <CheckCircle2 size={16} />
                  Mark as Completed
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
