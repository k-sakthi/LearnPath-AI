export type Topic = "DSA" | "OS" | "DBMS" | "Algorithms" | "Math" | "WebDev" | "ML" | "General";
export type Level = "beginner" | "intermediate" | "advanced";

export interface Course {
  id: string;
  title: string;
  topic: Topic;
  level: Level;
  duration_hours: number;
  description: string;
  tags: string[];
  resourceUrl: string;
  prerequisites: string[];
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
}

export interface Goal {
  type: string;
  hoursPerWeek: number;
  timeline: string;
  focusAreas: string;
}

export interface PathItem {
  courseId: string;
  weekNumber: number;
  priority: "critical" | "recommended" | "optional";
  reason: string;
  skillGap: string;
  estimatedHours: number;
}

export interface Path {
  overallStrategy: string;
  estimatedCompletion: string;
  path: PathItem[];
}

export interface Progress {
  completedCourses: string[]; // This will now represent Validated courses
  pendingCourses?: string[];  // NEW: courses pending reassessment validation
  lastUpdated: number;
  streakDays: number;
}

// --- ADAPTIVE REASSESSMENT TYPES ---

export type TopicMasteryLevel = "Weak" | "Improving" | "Moderate" | "Strong" | "Mastered";
export type ValidationState = "Not Started" | "Pending Validation" | "Validated Completion";

export interface ReassessmentHistory {
  id: string;
  topic: Topic;
  timestamp: number;
  previousScore: number;
  newScore: number;
  skillLevelVerdict: TopicMasteryLevel;
  explanation: string;
}
