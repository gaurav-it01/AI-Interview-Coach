import React from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, Clock, Lightbulb, MessageSquare, MinusCircle, Sparkles, Target } from 'lucide-react';
import { formatCategory, formatScore, getDifficulty, getScoreStatus } from '../../utils/resultMetrics';

const StatusIcon = ({ type }) => {
  if (type === 'excellent') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (type === 'good') return <MinusCircle className="w-4 h-4 text-blue-500" />;
  if (type === 'pending') return <Clock className="w-4 h-4 text-slate-400" />;
  return <AlertCircle className="w-4 h-4 text-amber-500" />;
};

const QuestionReviewAccordion = ({ evaluations }) => {
  const [openIndex, setOpenIndex] = React.useState(null);

  return (
    <div className="space-y-2">
      {evaluations.map((item, index) => {
        const isOpen = openIndex === index;
        const status = getScoreStatus(item.score, item);
        const difficulty = getDifficulty(item.question);
        const questionType = formatCategory(item.question);
        const scoreLabel = formatScore(item.score, item);
        const preview = item.question.length > 64 ? `${item.question.slice(0, 64)}…` : item.question;

        return (
          <div
            key={`${item.question}-${index}`}
            className={`rounded-xl border transition-all duration-300 ${
              isOpen
                ? 'border-primary-200 bg-white shadow-md'
                : 'border-slate-200/80 bg-white/90 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>

              <StatusIcon type={status.icon} />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                    {questionType}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${difficulty.badge}`}>
                    {difficulty.label}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800 truncate">{preview}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${status.badge}`}>
                  {scoreLabel === 'Pending' ? 'Pending' : `${scoreLabel}/10`}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-primary-600' : ''
                  }`}
                />
              </div>
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-3.5 pb-3.5 pt-0 space-y-2.5 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Question
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
                      {item.question}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Your Answer
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed bg-white rounded-lg p-3 border border-slate-200 italic">
                      &ldquo;{item.answer}&rdquo;
                    </p>
                  </div>

                  {scoreLabel === 'Pending' ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Pending Evaluation — detailed feedback was not available for this answer.
                    </div>
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <div className="bg-emerald-50/80 border border-emerald-100 rounded-lg p-2.5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Strengths
                          </p>
                          <p className="text-sm text-emerald-900 leading-relaxed">{item.strengths}</p>
                        </div>
                        <div className="bg-amber-50/80 border border-amber-100 rounded-lg p-2.5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 mb-1 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Weaknesses
                          </p>
                          <p className="text-sm text-amber-900 leading-relaxed">{item.weaknesses}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50/80 border border-blue-100 rounded-lg p-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 mb-1 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          Improvements
                        </p>
                        <p className="text-sm text-blue-900 leading-relaxed">{item.suggestions}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionReviewAccordion;
