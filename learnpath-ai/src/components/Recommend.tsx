import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import type { Goal, Path, PathItem, Topic } from "../types";
import { courses } from "../data/courses";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { BrainCircuit } from "lucide-react";
import { openResource } from "../lib/urlHelper";

interface RecommendProps {
  goal: Goal;
  skillScores: Record<Topic, number>;
  onComplete: (path: Path) => void;
}

const loadingTexts = [
  "Analyzing your skill profile...",
  "Matching courses to your goal...",
  "Crafting your personalized roadmap...",
  "Almost ready..."
];

export const Recommend: React.FC<RecommendProps> = ({ goal, skillScores, onComplete }) => {
  const { user } = useAuth();
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const [generatedPath, setGeneratedPath] = useState<Path | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let interval: any;
    if (!generatedPath && !isError) {
      interval = setInterval(() => {
        setLoadingTextIdx(prev => (prev + 1) % loadingTexts.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [generatedPath, isError]);

  useEffect(() => {
    generatePath();
  }, []);

  const generatePath = async () => {
    try {
      const prompt = `
You are an expert academic advisor and learning path designer.

STUDENT PROFILE:
- Skill Assessment Scores (out of 100): ${JSON.stringify(skillScores)}
- Learning Goal: ${goal.type}
- Available Time: ${goal.hoursPerWeek} hours per week
- Timeline: ${goal.timeline}
- Focus Areas: ${goal.focusAreas || 'Not specified'}

AVAILABLE COURSES (you must ONLY choose from this list):
${JSON.stringify(courses.map(c => ({ id: c.id, title: c.title, topic: c.topic, level: c.level, tags: c.tags })))}

YOUR TASK:
Select exactly 8-10 courses from the list above that best match this student.
Return ONLY valid JSON — no explanation text, no markdown, no backticks.
The JSON must have this exact structure:
{
  "overallStrategy": "2-3 sentence explanation of the learning strategy for this student",
  "estimatedCompletion": "e.g. 10 weeks at 15 hrs/week",
  "path": [
    {
      "courseId": "course id from the list",
      "weekNumber": 1,
      "priority": "critical",
      "reason": "Specific 1-sentence reason WHY this course for THIS student based on their scores and goal",
      "skillGap": "Which skill gap this fills",
      "estimatedHours": 10
    }
  ]
}
`;

      let parsedData: Path | null = null;
      let rawJson = "";

      try {
        // Fetching key from localStorage for a clean, secure deployment
        const geminiKey = localStorage.getItem("LEARNPATH_GEMINI_KEY");

        if (!geminiKey || geminiKey === "null") {
          throw new Error("Gemini API Key missing. Please use your .env file or browser console to set LEARNPATH_GEMINI_KEY.");
        }

        const genAI = new GoogleGenerativeAI(geminiKey);
        const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest"];
        let lastGeminiError: any = null;

        for (const modelName of modelsToTry) {
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              if (attempt > 0) await new Promise(r => setTimeout(r, 2000));
              const model = genAI.getGenerativeModel({ model: modelName });
              const result = await model.generateContent(prompt);
              const response = await result.response;
              rawJson = response.text();
              lastGeminiError = null;
              break;
            } catch (err: any) {
              lastGeminiError = err;
              console.warn(`Gemini ${modelName} attempt ${attempt + 1} failed:`, err.message);
            }
          }
          if (!lastGeminiError) break;
        }
        if (lastGeminiError) throw lastGeminiError;
      } catch (geminiError: any) {
        console.warn("Gemini Error, trying HuggingFace...", geminiError.message || geminiError);

        // Fetching key from localStorage for a clean, secure deployment
        const hfKey = localStorage.getItem("LEARNPATH_HF_KEY");

        if (!hfKey || hfKey === "null") {
          throw new Error("Hugging Face API Key missing. Please set LEARNPATH_HF_KEY in console.");
        }

        try {
          const hfRes = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${hfKey}`,
              "Content-Type": "application/json",
              "x-wait-for-model": "true"
            },
            body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 2000, return_full_text: false } })
          });

          if (!hfRes.ok) {
            throw new Error(`HuggingFace returned status: ${hfRes.status}`);
          }

          const hfData = await hfRes.json();
          rawJson = hfData[0]?.generated_text || "";
        } catch (hfError: any) {
          throw new Error(`Both AI providers failed. Gemini: ${geminiError.message || 'error'}. HuggingFace: ${hfError.message || 'Network error (CORS or offline)'}`);
        }
      }

      rawJson = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(rawJson) as Path;

      if (!parsedData || !parsedData.path) {
        throw new Error("Invalid output format from AI.");
      }

      setGeneratedPath(parsedData);

      if (user?.uid) {
        await setDoc(doc(db, "paths", user.uid), {
          ...parsedData,
          generatedAt: Date.now(),
          goalType: goal.type
        });
      }

    } catch (err: any) {
      console.error("AI Generation Error", err);
      setError(err.message || "Something went wrong.");
      setIsError(true);
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-rose-400 mb-4">Generation Failed</h2>
          <p className="text-textMuted mb-8">{error}</p>
          <Button onClick={() => { setIsError(false); setGeneratedPath(null); generatePath(); }}>Try Again</Button>
        </Card>
      </div>
    );
  }

  if (!generatedPath) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
        />
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360, filter: ["drop-shadow(0 0 10px #6366F1)", "drop-shadow(0 0 30px #8B5CF6)", "drop-shadow(0 0 10px #6366F1)"] }}
            transition={{ rotate: { repeat: Infinity, duration: 8, ease: "linear" }, filter: { repeat: Infinity, duration: 4 } }}
            className="text-primary mb-8"
          >
            <BrainCircuit size={80} strokeWidth={1} />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.h2
              key={loadingTextIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-display font-medium bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent"
            >
              {loadingTexts[loadingTextIdx]}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Your AI-Generated Learning Path</h1>
        <div className="flex justify-center items-center gap-3">
          <span className="text-textMuted">Customized for {user?.displayName || "You"}</span>
          <Badge colorStr="indigo">{goal.type}</Badge>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
        <Card className="p-8 mb-12 border-primary/20 bg-primary/5">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Strategy</h2>
            <Badge className="bg-gradient-to-r from-blue-500 to-red-500 text-white border-none flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" /></svg></Badge>
          </div>
          <p className="text-textPrimary leading-relaxed mb-4 text-lg">{generatedPath.overallStrategy}</p>
          <div className="flex items-center gap-2 text-textMuted text-sm font-medium">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Estimated: {generatedPath.estimatedCompletion}
          </div>
        </Card>
      </motion.div>

      <div className="relative ml-4 md:ml-8 border-l border-white/10 pb-8">
        {generatedPath.path.map((item, idx) => {
          const course = courses.find(c => c.id === item.courseId);
          if (!course) return null;

          return (
            <motion.div
              key={item.courseId + idx}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
              className="mb-8 relative pl-8 md:pl-12"
            >
              <div className="absolute top-4 -left-3.5 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                {idx + 1}
              </div>

              <Card className="p-6 transition-transform hover:-translate-y-1 hover:shadow-xl hover:border-white/20">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex gap-2 items-center mb-2 flex-wrap">
                      <Badge variant="priority" colorStr={item.priority === 'critical' ? 'red' : item.priority === 'recommended' ? 'amber' : 'blue'}>
                        {item.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="topic">{course.topic}</Badge>
                      <Badge>{course.duration_hours}h</Badge>
                      <span className="text-sm text-textMuted ml-2">Week {item.weekNumber}</span>
                    </div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openResource(course.resourceUrl)}>View Resource ↗</Button>
                </div>

                <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
                  <p className="text-sm italic text-gray-300">"{item.reason}"</p>
                  <p className="text-xs text-primary font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Fills gap: {item.skillGap}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Button variant="gradient" size="lg" className="px-12" onClick={() => onComplete(generatedPath)}>
          Start Learning &rarr;
        </Button>
      </div>
    </div>
  );
};
