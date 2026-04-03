import type { TopicMasteryLevel } from "../types";

export const generateVerdict = (
  baseScore: number,
  newScore: number
): { verdict: TopicMasteryLevel; explanation: string } => {
  const delta = newScore - baseScore;
  
  if (newScore >= 80) {
    return {
      verdict: "Mastered",
      explanation: `Topic mastered! Your score of ${Math.round(newScore)}% proves your deep understanding. Next priority will be promoted.`
    };
  }

  if (delta > 20) {
    return {
      verdict: "Strong",
      explanation: `Great improvement! Your reassessment score improved from ${Math.round(baseScore)}% to ${Math.round(newScore)}%. Priority lowered.`
    };
  }

  if (delta > 5) {
    return {
      verdict: "Improving",
      explanation: `Steady progress detected. You increased your score by ${Math.round(delta)}%. Keep reviewing.`
    };
  }

  if (delta <= 5 && newScore >= 60) {
    return {
      verdict: "Moderate",
      explanation: `Your skills are holding steady at ${Math.round(newScore)}%. Consider practicing more advanced topics to break the plateau.`
    };
  }

  return {
    verdict: "Weak",
    explanation: `This topic remains high priority. Your score in reassessment was ${Math.round(newScore)}%, indicating repeated errors. Focus heavily here before moving on.`
  };
};

export const getPriorityFromVerdict = (verdict: TopicMasteryLevel) => {
  switch (verdict) {
    case "Weak":
    case "Improving":
      return "High";
    case "Moderate":
      return "Medium";
    case "Strong":
    case "Mastered":
      return "Low";
  }
};
