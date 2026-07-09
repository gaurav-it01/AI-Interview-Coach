import React from 'react';
import { ArrowRight, Mic, Pause, RotateCcw, Square } from 'lucide-react';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VoiceControls = ({
  status,
  recordingSeconds,
  onStart,
  onPause,
  onStop,
  onRetry,
  onSubmit,
  canSubmit,
  isBusy,
  isLastQuestion,
}) => {
  const isRecording = status === 'recording';
  const isPaused = status === 'paused';
  const isStopped = status === 'stopped';

  return (
    <div className="space-y-4">
      {isRecording && (
        <p className="text-center text-sm font-mono text-violet-600 tabular-nums">
          {formatTime(recordingSeconds)}
        </p>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onStart}
          disabled={isBusy || isRecording}
          aria-label="Start recording"
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isRecording
              ? 'bg-violet-600 scale-105 shadow-violet-500/30'
              : 'bg-gradient-to-br from-violet-500 to-purple-600 hover:scale-105 hover:shadow-violet-500/40 shadow-violet-500/25'
          } disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed`}
        >
          {isRecording && (
            <span className="absolute inset-0 rounded-full bg-violet-400/30 animate-ping" />
          )}
          <Mic className="w-8 h-8 text-white relative z-10" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onStart}
          disabled={isBusy || isRecording}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100 transition-colors disabled:opacity-50"
        >
          <Mic className="w-4 h-4" />
          Start Recording
        </button>

        <button
          type="button"
          onClick={onPause}
          disabled={isBusy || !isRecording}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100 transition-colors disabled:opacity-50"
        >
          <Pause className="w-4 h-4" />
          Pause
        </button>

        <button
          type="button"
          onClick={onStop}
          disabled={isBusy || (!isRecording && !isPaused)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors disabled:opacity-50"
        >
          <Square className="w-4 h-4" />
          Stop
        </button>

        <button
          type="button"
          onClick={onRetry}
          disabled={isBusy || isRecording}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          Retry
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isBusy || !canSubmit}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:shadow-md transition-all disabled:opacity-50"
        >
          {isLastQuestion ? 'Submit Interview' : 'Submit Answer'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default VoiceControls;
