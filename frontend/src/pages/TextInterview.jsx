import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Bot, CheckCircle, Loader2, Send, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { evaluateInterview, generateQuestions, nextQuestion, reset, resetInterview, saveAnswer } from '../store/slices/interviewSlice';

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-1 py-2">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-slate-400 animate-pulse-soft"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

const TextInterview = () => {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const [currentInput, setCurrentInput] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const prevQuestionIndex = useRef(0);

  const { questions, answers, currentQuestionIndex, isGenerating, isEvaluating, isError, message, usedFallbackQuestions } = useSelector(
    (state) => state.interview
  );

  useEffect(() => {
    if (!resumeId) {
      return undefined;
    }

    dispatch(resetInterview());
    dispatch(generateQuestions(resumeId));

    return () => {
      dispatch(resetInterview());
    };
  }, [dispatch, resumeId]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    if (usedFallbackQuestions && message) {
      toast.info(message);
    }
  }, [usedFallbackQuestions, message]);

  useEffect(() => {
    if (currentQuestionIndex > prevQuestionIndex.current && questions.length) {
      setShowTyping(true);
      const timer = setTimeout(() => setShowTyping(false), 700);
      prevQuestionIndex.current = currentQuestionIndex;
      return () => clearTimeout(timer);
    }
    prevQuestionIndex.current = currentQuestionIndex;
    return undefined;
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    return () => cancelAnimationFrame(frame);
  }, [currentQuestionIndex, answers, isEvaluating, questions.length, showTyping]);

  const handleNext = async () => {
    if (currentInput.trim() === '') {
      toast.warn('Please provide an answer before continuing.');
      return;
    }

    const trimmedAnswer = currentInput.trim();
    dispatch(saveAnswer({ questionIndex: currentQuestionIndex, answer: trimmedAnswer }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentInput('');
      dispatch(nextQuestion());
      return;
    }

    try {
      const qaPairs = questions.map((q, idx) => ({
        question: q.question,
        answer: idx === currentQuestionIndex ? trimmedAnswer : answers[idx],
      }));

      const result = await dispatch(evaluateInterview({ resumeId, qaPairs })).unwrap();
      toast.success('Interview evaluated successfully!');
      navigate(`/result/${result._id}`);
    } catch (err) {
      toast.error(`Failed to evaluate interview responses. ${err}`);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen landing-mesh flex flex-col items-center justify-center px-4 text-center">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Generating your interview</h2>
        <p className="text-slate-500 mt-2 max-w-xl text-sm">Reading your resume and crafting personalized questions. This may take up to 15 seconds.</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen landing-mesh flex flex-col items-center justify-center px-4 text-center">
        <Bot className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">No interview questions available</h2>
        <p className="text-slate-500 mt-2 max-w-xl text-sm">We could not prepare questions for this resume. Please return to the dashboard and try again.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mt-6 btn-primary"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const chatHistory = [];
  for (let i = 0; i <= currentQuestionIndex; i += 1) {
    chatHistory.push({ role: 'ai', content: questions[i].question, type: questions[i].type, index: i });

    if (i < currentQuestionIndex && answers[i]) {
      chatHistory.push({ role: 'user', content: answers[i], index: i });
    }
  }

  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="h-[100dvh] bg-slate-50 flex flex-col">
      <header className="flex-shrink-0 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Mock Interview</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI Coach active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Q{currentQuestionIndex + 1} / {questions.length}
          </span>
          <div className="h-2 flex-1 sm:w-36 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-blue-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      <div
        ref={chatContainerRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain"
      >
        <main className="max-w-3xl w-full mx-auto px-4 py-5 sm:px-6">
          {usedFallbackQuestions && (
            <div className="mb-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-xs uppercase tracking-wide">Fallback mode</p>
                <p className="mt-1 leading-relaxed text-sm">
                  {message || 'AI question generation is temporarily unavailable, so we loaded a curated fallback interview set.'}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {chatHistory.map((chat, idx) => {
              const isLatestQuestion = chat.role === 'ai' && chat.index === currentQuestionIndex;

              return (
                <div
                  key={`${chat.role}-${chat.index}-${idx}`}
                  className={`flex w-full animate-fade-up ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[92%] sm:max-w-[85%] gap-2.5 ${chat.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
                      chat.role === 'user' ? 'bg-slate-800 text-white' : 'bg-gradient-to-br from-primary-500 to-blue-600 text-white'
                    }`}>
                      {chat.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className={`flex min-w-0 flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {chat.role === 'ai' && chat.type && (
                        <span className="text-[10px] font-semibold text-primary-600 mb-1 uppercase tracking-wider">
                          {chat.type}
                        </span>
                      )}
                      <div className={`break-words px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                        chat.role === 'user'
                          ? 'bg-slate-800 text-white rounded-tr-sm'
                          : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                      }`}>
                        {chat.content}
                      </div>
                      {isLatestQuestion && showTyping && (
                        <div className="mt-1 ml-1">
                          <TypingIndicator />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isEvaluating && (
              <div className="flex w-full justify-start animate-fade-up">
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-100 text-slate-600 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                  Evaluating your answers…
                </div>
              </div>
            )}

            <div ref={chatEndRef} className="h-2 scroll-mt-4" aria-hidden="true" />
          </div>
        </main>
      </div>

      <div className="flex-shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            disabled={isEvaluating}
            placeholder={isEvaluating ? 'Evaluating…' : 'Type your answer here…'}
            aria-label="Your answer"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-14 py-3.5 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none h-[72px] text-[15px] disabled:opacity-50 transition-shadow"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleNext();
              }
            }}
          />
          <button
            type="button"
            onClick={handleNext}
            disabled={isEvaluating}
            aria-label={isEvaluating ? 'Evaluating answer' : currentQuestionIndex === questions.length - 1 ? 'Submit interview' : 'Send answer'}
            className="absolute right-2 top-2 bottom-2 w-11 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition-all shadow-sm"
          >
            {isEvaluating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : currentQuestionIndex === questions.length - 1 ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="max-w-3xl mx-auto mt-2 text-center text-[11px] text-slate-400">
          Enter to submit · Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default TextInterview;
