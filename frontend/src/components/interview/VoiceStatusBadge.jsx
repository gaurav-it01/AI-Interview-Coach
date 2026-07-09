import React from 'react';
import { Loader2, Mic, Volume2 } from 'lucide-react';

const STATUS_CONFIG = {
  'ai-speaking': { label: 'AI is speaking…', icon: Volume2, color: 'text-primary-600 bg-primary-50 border-primary-100' },
  listening: { label: 'Listening…', icon: Mic, color: 'text-violet-600 bg-violet-50 border-violet-100' },
  processing: { label: 'Processing speech…', icon: Loader2, color: 'text-amber-600 bg-amber-50 border-amber-100', spin: true },
  'generating-next': { label: 'Generating next question…', icon: Loader2, color: 'text-slate-600 bg-slate-100 border-slate-200', spin: true },
  evaluating: { label: 'Evaluating your answers…', icon: Loader2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', spin: true },
  ready: { label: 'Ready to record', icon: Mic, color: 'text-slate-600 bg-slate-50 border-slate-200' },
  paused: { label: 'Recording paused', icon: Mic, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  stopped: { label: 'Review your transcript', icon: Mic, color: 'text-blue-600 bg-blue-50 border-blue-100' },
};

const VoiceStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ready;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${config.color}`}>
      <Icon className={`w-3.5 h-3.5 ${config.spin ? 'animate-spin' : ''}`} />
      {config.label}
    </div>
  );
};

export default VoiceStatusBadge;
