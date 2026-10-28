import React from 'react';
import { Bot, Sparkles, CheckCircle2, Mic, Activity, Award, ShieldCheck } from 'lucide-react';

const AuthLayout = ({ children, isSignupRoute, onToggleMode }) => {
  return (
    <div className="min-h-screen w-full auth-mesh flex flex-col justify-between font-sans antialiased text-slate-800 selection:bg-primary-500 selection:text-white relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl pointer-events-none animate-blob" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none animate-blob-slow" />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT SIDE — AI Interview Coach Branding & Showcase (Visible on lg screens) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-4">
            
            {/* Logo & Version Badge */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <Bot className="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                    AI Interview<span className="text-primary-600">Coach</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary-600">
                    <Sparkles className="w-3 h-3" /> Next-Gen AI SaaS
                  </span>
                </div>
              </div>

              {/* Product Headline */}
              <h1 className="text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Your AI-powered partner for <span className="text-gradient">interview success.</span>
              </h1>

              {/* Supporting Description */}
              <p className="text-base text-slate-600 leading-relaxed max-w-lg font-normal">
                Master your interviews with instant AI feedback, real-time speech analysis, custom role questions, and confidence building analytics.
              </p>
            </div>

            {/* Visually Appealing AI Preview Visual Card */}
            <div className="relative bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-xl shadow-slate-200/50 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-700">Live AI Performance Analyzer</span>
                </div>
                <span className="text-[11px] font-medium bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-200/50 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Active Session
                </span>
              </div>

              {/* Metrics Showcase Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Score</span>
                  <span className="text-xl font-black text-slate-900">92<span className="text-xs font-semibold text-emerald-600">%</span></span>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Clarity</span>
                  <span className="text-xl font-black text-primary-600">High</span>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pace</span>
                  <span className="text-xl font-black text-slate-900">142 <span className="text-[10px] font-semibold text-slate-500">WPM</span></span>
                </div>
              </div>

              {/* Floating AI Feedback Badge */}
              <div className="p-3 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100/80 rounded-xl flex items-start gap-2.5">
                <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-snug">
                  <strong className="text-slate-900 font-semibold">AI Coach Insight:</strong> "Excellent technical depth on React hooks. Try pacing your answer slightly slower for key points."
                </p>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                'AI-powered mock interviews',
                'Personalized feedback',
                'Real-time performance analysis',
                'Interview preparation',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white/60 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/60 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Trust Footer Message */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-700">Practice smarter. Interview better. Get hired.</span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Powered by AI
              </span>
            </div>
          </div>

          {/* RIGHT SIDE — Authentication Glass Card */}
          <div className="col-span-1 lg:col-span-6 w-full max-w-lg mx-auto">
            
            {/* Mobile Header (Shown only on small/medium screens) */}
            <div className="lg:hidden text-center mb-6 space-y-2">
              <div className="inline-flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  AI Interview<span className="text-primary-600">Coach</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">Practice smarter. Interview better. Get hired.</p>
            </div>

            {/* Card Container */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-9 shadow-2xl relative border border-white/80 transition-all duration-300">
              
              {/* Login / Signup Mode Switcher Header */}
              <div className="flex items-center justify-between mb-6 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => !isSignupRoute ? null : onToggleMode('/login')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                    !isSignupRoute
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => isSignupRoute ? null : onToggleMode('/signup')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isSignupRoute
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Form Content */}
              {children}
            </div>

            {/* Mobile / Card Extra Footer Tagline */}
            <div className="text-center mt-6 text-xs text-slate-400 font-medium">
              Powered by AI • Personalized for your career
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
