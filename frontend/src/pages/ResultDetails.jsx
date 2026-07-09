import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getResultById, reset } from '../store/slices/interviewSlice';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Brain,
  Loader2,
  MessageCircle,
  RefreshCw,
  Star,
  Target,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'react-toastify';
import AiCoachSummary from '../components/feedback/AiCoachSummary';
import AnimatedScoreBar from '../components/feedback/AnimatedScoreBar';
import OverallScoreHero from '../components/feedback/OverallScoreHero';
import QuestionReviewAccordion from '../components/feedback/QuestionReviewAccordion';
import SummaryMetricCard from '../components/feedback/SummaryMetricCard';
import {
  aggregateFeedback,
  getPerformanceInsights,
  getScoreTone,
  isPendingEvaluation,
  isResultPending,
} from '../utils/resultMetrics';

const SKILL_ROWS = [
  { key: 'communication', label: 'Communication', color: 'from-blue-500 to-cyan-500' },
  { key: 'technical', label: 'Technical', color: 'from-violet-500 to-purple-500' },
  { key: 'structure', label: 'STAR / Behavioral', color: 'from-emerald-500 to-teal-500' },
];

const ResultDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentResult, isLoading, isError, message } = useSelector(
    (state) => state.interview
  );

  useEffect(() => {
    if (id) {
      dispatch(getResultById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const analytics = useMemo(() => {
    if (!currentResult?.evaluations?.length) return null;

    return {
      insights: getPerformanceInsights(currentResult.evaluations, currentResult.averageScore),
      feedback: aggregateFeedback(currentResult.evaluations),
    };
  }, [currentResult]);

  if (isLoading) {
    return (
      <div className="min-h-screen landing-mesh flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading your results...</p>
      </div>
    );
  }

  if (isError || !currentResult || !analytics) {
    return (
      <div className="min-h-screen landing-mesh flex flex-col items-center justify-center px-4 text-center">
        <div className="glass rounded-2xl border border-white/60 shadow-xl p-8 max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Unable to load results</h2>
          <p className="text-slate-500 mt-2 text-sm">
            {message || 'This interview result could not be found or you may not have access to it.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const { insights, feedback } = analytics;
  const formattedDate = new Date(currentResult.createdAt).toLocaleString();
  const resumeId = currentResult.resume?._id || currentResult.resume;
  const resultPending = isResultPending(currentResult.evaluations);

  return (
    <div className="min-h-screen landing-mesh pb-8">
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            type="button"
            aria-label="Back to dashboard"
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-slate-900 truncate">Interview Results</h1>
            <p className="text-xs text-slate-500 truncate">{formattedDate}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-5">
        <OverallScoreHero
          score={currentResult.averageScore}
          resumeName={currentResult.resume?.fileName}
          completedAt={formattedDate}
          questionCount={insights.questionCount}
          evaluations={currentResult.evaluations}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <SummaryMetricCard icon={MessageCircle} label="Communication" value={insights.dimensions.communication} delay={60} accent="primary" pending={resultPending} />
          <SummaryMetricCard icon={Brain} label="Technical" value={insights.dimensions.technical} delay={120} accent="violet" pending={resultPending} />
          <SummaryMetricCard icon={Star} label="STAR Score" value={insights.dimensions.structure} delay={180} accent="emerald" pending={resultPending} />
          <SummaryMetricCard icon={Target} label="Questions" value={insights.questionCount} suffix="" showRing={false} accent="slate" />
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          <section className="lg:col-span-3 space-y-4">
            <div className="glass rounded-xl border border-white/60 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-primary-600" />
                <h2 className="text-sm font-bold text-slate-900">Score by Question</h2>
              </div>
              <div className="space-y-2.5">
                {currentResult.evaluations.map((item, index) => (
                  <AnimatedScoreBar
                    key={`bar-${index}`}
                    label={`Q${index + 1}`}
                    value={item.score}
                    delay={index * 50}
                    pending={isPendingEvaluation(item)}
                  />
                ))}
              </div>
            </div>

            <div className="glass rounded-xl border border-white/60 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                <h2 className="text-sm font-bold text-slate-900">Performance Summary</h2>
              </div>
              <div className="space-y-3">
                {SKILL_ROWS.map((skill) => {
                  const data = insights.distribution[skill.key];
                  const avg = data.count ? Number((data.totalScore / data.count).toFixed(1)) : 0;

                  return (
                    <AnimatedScoreBar
                      key={skill.key}
                      label={`${skill.label} (${data.count})`}
                      value={avg}
                      delay={100}
                      colorClass={skill.color}
                    />
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Highest', value: insights.highest },
                  { label: 'Average', value: Number(currentResult.averageScore).toFixed(1) },
                  { label: 'Lowest', value: insights.lowest },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-50 rounded-lg py-2 px-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{stat.label}</p>
                    <p className={`text-base font-extrabold ${getScoreTone(stat.value)}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="lg:col-span-2">
            <AiCoachSummary feedback={feedback} />
          </section>
        </div>

        <section>
          <div className="mb-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">Question Review</p>
            <h2 className="text-base font-bold text-slate-900">{insights.questionCount} questions — expand for details</h2>
          </div>
          <QuestionReviewAccordion evaluations={currentResult.evaluations} />
        </section>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
          {resumeId && (
            <button
              type="button"
              onClick={() => navigate(`/interview/${resumeId}`)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-blue-600 text-white font-semibold text-sm hover:shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Practice Again
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default ResultDetails;
