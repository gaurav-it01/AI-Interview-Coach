const categorizeEvaluation = (question) => {
  const q = question.toLowerCase();
  if (/technical|code|debug|design|implement|system|algorithm|api|database|architecture/.test(q)) {
    return 'technical';
  }
  if (/star|structure|situation|behavioral|tell me about|describe a time|challenge you faced/.test(q)) {
    return 'structure';
  }
  return 'communication';
};

const formatCategory = (question) => {
  const category = categorizeEvaluation(question);
  if (category === 'structure') return 'STAR / Behavioral';
  if (category === 'technical') return 'Technical';
  return 'Communication';
};

const average = (values) => {
  if (!values.length) return null;
  return Number((values.reduce((sum, score) => sum + score, 0) / values.length).toFixed(1));
};

const computeDimensionScores = (evaluations, overallFallback) => {
  const buckets = { communication: [], technical: [], structure: [] };

  evaluations.forEach((item) => {
    const category = categorizeEvaluation(item.question);
    buckets[category].push(Number(item.score) || 0);
  });

  const fallback = Number(overallFallback) || 0;

  return {
    communication: average(buckets.communication) ?? fallback,
    technical: average(buckets.technical) ?? fallback,
    structure: average(buckets.structure) ?? fallback,
  };
};

const buildSummaryFeedback = (evaluations) => {
  const strengths = evaluations
    .map((item) => item.strengths)
    .find((value) => value && value !== 'N/A' && value.trim().length > 0);

  const suggestions = evaluations
    .map((item) => item.suggestions)
    .find((value) => value && value !== 'N/A' && value.trim().length > 0);

  if (strengths && suggestions) {
    return `${strengths} ${suggestions}`;
  }

  return suggestions || strengths || 'Review your session breakdown below for detailed insights.';
};

const getDifficulty = (question) => {
  const category = categorizeEvaluation(question);
  if (category === 'technical') {
    return { label: 'Advanced', badge: 'bg-violet-50 text-violet-700 border-violet-200' };
  }
  if (category === 'structure') {
    return { label: 'Behavioral', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  }
  return { label: 'Standard', badge: 'bg-slate-100 text-slate-600 border-slate-200' };
};

const isPendingEvaluation = (evaluation) => {
  if (!evaluation) return true;

  const strengths = (evaluation.strengths || '').toLowerCase();
  const weaknesses = (evaluation.weaknesses || '').toLowerCase();
  const suggestions = (evaluation.suggestions || '').toLowerCase();

  return (
    weaknesses.includes('detailed evaluation unavailable')
    || strengths === 'response recorded.'
    || (evaluation.strengths === 'N/A' && evaluation.weaknesses === 'N/A' && evaluation.suggestions === 'N/A')
    || (strengths === 'n/a' && weaknesses === 'n/a' && suggestions === 'n/a')
  );
};

const isResultPending = (evaluations) => {
  if (!evaluations?.length) return true;
  return evaluations.every(isPendingEvaluation);
};

const formatScore = (score, evaluation) => {
  if (isPendingEvaluation(evaluation)) return 'Pending';
  const numeric = Number(score);
  if (!Number.isFinite(numeric)) return 'Pending';
  return numeric.toFixed(1);
};

const getScoreStatus = (score, evaluation) => {
  if (isPendingEvaluation(evaluation)) {
    return { label: 'Pending', badge: 'bg-slate-100 text-slate-600 border-slate-200', icon: 'pending' };
  }
  const numeric = Number(score) || 0;
  if (numeric >= 8) {
    return { label: 'Excellent', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'excellent' };
  }
  if (numeric >= 6) {
    return { label: 'Good', badge: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'good' };
  }
  return { label: 'Needs Work', badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'needs-work' };
};

const getScoreTone = (score) => {
  const numeric = Number(score) || 0;
  if (numeric >= 8) return 'text-emerald-600';
  if (numeric >= 6) return 'text-primary-600';
  return 'text-amber-600';
};

const getRingColor = (score) => {
  const numeric = Number(score) || 0;
  if (numeric >= 8) return '#10b981';
  if (numeric >= 6) return '#0284c7';
  return '#f59e0b';
};

const uniqueFieldValues = (evaluations, field) => [
  ...new Set(
    evaluations
      .map((item) => item[field])
      .filter((value) => value && value !== 'N/A' && value.trim().length > 0)
  ),
];

const aggregateFeedback = (evaluations) => ({
  strengths: uniqueFieldValues(evaluations, 'strengths'),
  weaknesses: uniqueFieldValues(evaluations, 'weaknesses'),
  improvements: uniqueFieldValues(evaluations, 'suggestions'),
  recommendation: buildSummaryFeedback(evaluations),
});

const getPerformanceInsights = (evaluations, averageScore) => {
  const scores = evaluations.map((item) => Number(item.score) || 0);
  const dimensions = computeDimensionScores(evaluations, averageScore);

  const distribution = evaluations.reduce(
    (acc, item) => {
      const category = categorizeEvaluation(item.question);
      acc[category].count += 1;
      acc[category].totalScore += Number(item.score) || 0;
      return acc;
    },
    {
      communication: { count: 0, totalScore: 0 },
      technical: { count: 0, totalScore: 0 },
      structure: { count: 0, totalScore: 0 },
    }
  );

  return {
    scores,
    highest: scores.length ? Math.max(...scores) : 0,
    lowest: scores.length ? Math.min(...scores) : 0,
    dimensions,
    distribution,
    questionCount: evaluations.length,
  };
};

export {
  categorizeEvaluation,
  formatCategory,
  computeDimensionScores,
  buildSummaryFeedback,
  getDifficulty,
  isPendingEvaluation,
  isResultPending,
  formatScore,
  getScoreStatus,
  getScoreTone,
  getRingColor,
  aggregateFeedback,
  getPerformanceInsights,
};
