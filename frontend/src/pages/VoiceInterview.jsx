import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Bot, Loader2, Volume2 } from 'lucide-react';
import { toast } from 'react-toastify';
import RecordingWaveform from '../components/interview/RecordingWaveform';
import VoiceControls from '../components/interview/VoiceControls';
import VoiceStatusBadge from '../components/interview/VoiceStatusBadge';
import useSpeechToText from '../hooks/useSpeechToText';
import useTextToSpeech from '../hooks/useTextToSpeech';
import {
  evaluateInterview,
  generateQuestions,
  nextQuestion,
  reset,
  resetInterview,
  saveAnswer,
} from '../store/slices/interviewSlice';

const VoiceInterview = () => {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spokenIndexRef = useRef(-1);
  const micCheckedRef = useRef(false);
  const [editableAnswer, setEditableAnswer] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [micReady, setMicReady] = useState(false);

  const {
    questions,
    answers,
    currentQuestionIndex,
    isGenerating,
    isEvaluating,
    isError,
    message,
    usedFallbackQuestions,
  } = useSelector((state) => state.interview);

  const fallbackToText = useCallback(() => {
    toast.info('Switching to text interview.');
    navigate(`/interview/${resumeId}/text`, { replace: true });
  }, [navigate, resumeId]);

  const { speak, cancel, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  const speech = useSpeechToText({ onPermissionDenied: fallbackToText });

  useEffect(() => {
    if (!resumeId) return undefined;

    dispatch(resetInterview());
    dispatch(generateQuestions(resumeId));

    return () => {
      cancel();
      speech.stopRecognition();
      dispatch(resetInterview());
    };
  }, [dispatch, resumeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (micCheckedRef.current) return undefined;

    const checkVoiceSupport = async () => {
      micCheckedRef.current = true;

      if (!ttsSupported || !speech.isSupported) {
        toast.warn('Voice interview is not supported in this browser.');
        fallbackToText();
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        toast.warn('Microphone access is unavailable.');
        fallbackToText();
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setMicReady(true);
      } catch {
        toast.warn('Microphone permission denied.');
        fallbackToText();
      }
    };

    checkVoiceSupport();
  }, [fallbackToText, speech.isSupported, ttsSupported]);

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
    if (!micReady || !questions.length || isGenerating || isEvaluating) return undefined;

    if (spokenIndexRef.current === currentQuestionIndex) return undefined;

    spokenIndexRef.current = currentQuestionIndex;
    speech.retryRecording();
    setEditableAnswer('');

    const questionText = questions[currentQuestionIndex]?.question;
    if (!questionText) return undefined;

    const timer = setTimeout(() => {
      speak(questionText);
    }, 400);

    return () => clearTimeout(timer);
  }, [micReady, questions, currentQuestionIndex, isGenerating, isEvaluating, speak, speech]);

  useEffect(() => {
    if (speech.isRecording) {
      setEditableAnswer(speech.displayTranscript);
    } else if (speech.isStopped || speech.isPaused) {
      setEditableAnswer(speech.displayTranscript);
    }
  }, [speech.displayTranscript, speech.isRecording, speech.isStopped, speech.isPaused]);

  const handleSubmit = async () => {
    if (speech.isRecording) speech.stopRecording();

    const finalAnswer = (editableAnswer || speech.displayTranscript).trim();
    if (!finalAnswer) {
      toast.warn('Please record or enter an answer before continuing.');
      return;
    }

    if (isSpeaking) cancel();

    dispatch(saveAnswer({ questionIndex: currentQuestionIndex, answer: finalAnswer }));

    if (currentQuestionIndex < questions.length - 1) {
      setIsTransitioning(true);
      speech.retryRecording();
      setEditableAnswer('');
      dispatch(nextQuestion());
      setTimeout(() => setIsTransitioning(false), 600);
      return;
    }

    try {
      const qaPairs = questions.map((q, idx) => ({
        question: q.question,
        answer: idx === currentQuestionIndex ? finalAnswer : answers[idx],
      }));

      const result = await dispatch(evaluateInterview({ resumeId, qaPairs })).unwrap();
      toast.success('Interview evaluated successfully!');
      navigate(`/result/${result._id}`);
    } catch (err) {
      toast.error(`Failed to evaluate interview responses. ${err}`);
    }
  };

  const getVoiceStatus = () => {
    if (isEvaluating) return 'evaluating';
    if (isTransitioning) return 'generating-next';
    if (isSpeaking) return 'ai-speaking';
    if (speech.isRecording) return 'listening';
    if (speech.isPaused) return 'paused';
    if (speech.isStopped) return 'stopped';
    return 'ready';
  };

  const voiceStatus = getVoiceStatus();
  const isBusy = isSpeaking || isEvaluating || isTransitioning;
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = questions.length
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  const liveTranscript = speech.isRecording
    ? speech.displayTranscript
    : editableAnswer;

  if (isGenerating || !micReady) {
    return (
      <div className="min-h-screen landing-mesh flex flex-col items-center justify-center px-4 text-center">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">
          {isGenerating ? 'Generating your interview' : 'Preparing voice interview'}
        </h2>
        <p className="text-slate-500 mt-2 max-w-xl text-sm">
          {isGenerating
            ? 'Reading your resume and crafting personalized questions.'
            : 'Checking microphone and speech capabilities…'}
        </p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen landing-mesh flex flex-col items-center justify-center px-4 text-center">
        <Bot className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">No interview questions available</h2>
        <button type="button" onClick={() => navigate('/dashboard')} className="mt-6 btn-primary">
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] landing-mesh flex flex-col">
      <header className="flex-shrink-0 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              <h1 className="text-base font-bold text-slate-900">Voice Interview</h1>
              <p className="text-xs text-violet-600 font-medium">English only</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              Q{currentQuestionIndex + 1} / {questions.length}
            </span>
            <div className="h-2 flex-1 sm:w-36 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-5 sm:px-6 space-y-5">
          {usedFallbackQuestions && (
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{message || 'Fallback interview questions are in use.'}</p>
            </div>
          )}

          <div className="flex justify-center">
            <VoiceStatusBadge status={voiceStatus} />
          </div>

          <div className="glass rounded-2xl border border-white/60 shadow-lg p-5 sm:p-6 animate-fade-up">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                {isSpeaking ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className="min-w-0 flex-1">
                {currentQuestion?.type && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-600">
                    {currentQuestion.type}
                  </span>
                )}
                <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed mt-1">
                  {currentQuestion?.question}
                </p>
              </div>
            </div>

            {isSpeaking && (
              <div className="flex items-center gap-2 text-xs text-primary-600 font-medium mb-4 ml-[52px]">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1 h-3 bg-primary-500 rounded-full animate-pulse-soft"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
                AI interviewer is speaking…
              </div>
            )}
          </div>

          <div className="glass rounded-2xl border border-white/60 shadow-md p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Your Answer {speech.isRecording && <span className="text-violet-600">· Live transcript</span>}
            </p>

            <RecordingWaveform active={speech.isRecording} />

            <textarea
              value={liveTranscript}
              onChange={(e) => setEditableAnswer(e.target.value)}
              disabled={isBusy || speech.isRecording}
              placeholder={
                isSpeaking
                  ? 'Listen to the question…'
                  : speech.isRecording
                    ? 'Speak your answer…'
                    : 'Your transcript will appear here. You can edit before submitting.'
              }
              className="w-full mt-4 bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-[15px] leading-relaxed min-h-[100px] focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 disabled:bg-slate-50 disabled:text-slate-600 resize-none transition-shadow"
            />

            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Voice interviews are currently available only in English.
            </p>
          </div>

          <VoiceControls
            status={speech.status}
            recordingSeconds={speech.recordingSeconds}
            onStart={speech.startRecording}
            onPause={speech.pauseRecording}
            onStop={speech.stopRecording}
            onRetry={() => {
              speech.retryRecording();
              setEditableAnswer('');
            }}
            onSubmit={handleSubmit}
            canSubmit={Boolean((editableAnswer || speech.displayTranscript).trim()) && !isSpeaking}
            isBusy={isBusy}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        </div>
      </main>
    </div>
  );
};

export default VoiceInterview;
