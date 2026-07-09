import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Keyboard, Mic, Sparkles } from 'lucide-react';

const MODES = [
  {
    id: 'text',
    title: 'Text Interview',
    description: 'Type your answers in a familiar chat interface. Best for detailed, structured responses.',
    icon: Keyboard,
    accent: 'from-primary-500 to-blue-600',
    badge: 'Default',
  },
  {
    id: 'voice',
    title: 'Voice Interview',
    description: 'Speak your answers naturally. The AI interviewer reads questions aloud and transcribes your speech.',
    icon: Mic,
    accent: 'from-violet-500 to-purple-600',
    badge: 'New',
  },
];

const InterviewModeSelect = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState('text');

  const handleContinue = () => {
    navigate(`/interview/${resumeId}/${selectedMode}`);
  };

  return (
    <div className="min-h-screen landing-mesh flex flex-col">
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Choose Interview Mode</h1>
            <p className="text-xs text-slate-500">Select how you want to practice</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-2xl animate-fade-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              AI Mock Interview
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How would you like to interview?
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Both modes use the same AI questions and evaluation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;
              const Icon = mode.icon;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedMode(mode.id)}
                  className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-500 bg-white shadow-lg shadow-primary-500/10 scale-[1.02]'
                      : 'border-slate-200 bg-white/80 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {mode.badge}
                  </span>

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.accent} text-white flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">{mode.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{mode.description}</p>

                  <div className={`mt-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-primary-500' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedMode === 'voice' && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-violet-50 border border-violet-100 text-sm text-violet-800 animate-fade-up">
              Voice interviews are currently available only in English.
            </div>
          )}

          <button
            type="button"
            onClick={handleContinue}
            className="btn-primary w-full py-3.5 text-base"
          >
            Continue with {selectedMode === 'voice' ? 'Voice' : 'Text'} Interview
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default InterviewModeSelect;
