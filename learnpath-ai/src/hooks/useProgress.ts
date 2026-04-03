import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Progress } from "../types";

export const useProgress = (userId: string | undefined) => {
  const [progress, setProgress] = useState<Progress>({
    completedCourses: [],
    pendingCourses: [],
    lastUpdated: Date.now(),
    streakDays: 0
  });

  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(doc(db, "progress", userId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Progress;
        setProgress({ pendingCourses: [], ...data });
      } else {
        // Initialize if not present
        setDoc(doc(db, "progress", userId), progress);
      }
    });

    return () => unsub();
  }, [userId]);

  const toggleCourse = async (courseId: string) => {
    if (!userId) return;

    let updatedCompleted = [...progress.completedCourses];
    let updatedPending = [...(progress.pendingCourses || [])];

    if (updatedCompleted.includes(courseId)) {
      updatedCompleted = updatedCompleted.filter(id => id !== courseId);
    } else if (updatedPending.includes(courseId)) {
      updatedPending = updatedPending.filter(id => id !== courseId);
    } else {
      updatedPending.push(courseId);
    }

    const nextProgress: Progress = {
      ...progress,
      completedCourses: updatedCompleted,
      pendingCourses: updatedPending,
      lastUpdated: Date.now(),
    };

    await setDoc(doc(db, "progress", userId), nextProgress);
  };

  const validateCourses = async (courseIds: string[]) => {
    if (!userId) return;
    
    let updatedCompleted = [...progress.completedCourses];
    let updatedPending = [...(progress.pendingCourses || [])];
    
    courseIds.forEach(id => {
      if (!updatedCompleted.includes(id)) {
        updatedCompleted.push(id);
      }
      updatedPending = updatedPending.filter(pendingId => pendingId !== id);
    });

    const nextProgress: Progress = {
      ...progress,
      completedCourses: updatedCompleted,
      pendingCourses: updatedPending,
      lastUpdated: Date.now(),
    };

    await setDoc(doc(db, "progress", userId), nextProgress);
  };

  return { progress, toggleCourse, validateCourses };
};
