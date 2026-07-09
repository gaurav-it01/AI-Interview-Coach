import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  ChevronRight,
  Code2,
  FileText,
  History,
  Mail,
  Menu,
  MessageSquare,
  Sparkles,
  Star,
  Target,
  Upload,
  Users,
  X,
  Zap,
} from 'lucide-react';
import FaqAccordion from '../components/landing/FaqAccordion';
import ScrollReveal from '../components/landing/ScrollReveal';
import AiFeedbackPanel from '../components/feedback/AiFeedbackPanel';

const GITHUB_URL = 'https://github.com/gaurav-it01/AI-Interview-Coach';
const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com';
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'contact@interviewcoach.ai';

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#features', label: 'Features' },
  { href: '#preview', label: 'Preview' },
  { href: '#included', label: 'What You Get' },
  { href: '#faq', label: 'FAQ' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Resume',
    desc: 'Drop your PDF resume and our parser extracts skills, experience, and projects instantly.',
  },
  {
    step: '02',
    icon: Brain,
    title: 'AI Generates Questions',
    desc: 'Tailored technical and behavioral questions are created based on your unique background.',
  },
  {
    step: '03',
    icon: MessageSquare,
    title: 'Practice Interview',
    desc: 'Answer realistic questions in a focused, distraction-free interview environment.',
  },
  {
    step: '04',
    icon: Zap,
    title: 'Receive Instant Feedback',
    desc: 'Get scored feedback with STAR analysis, strengths, and actionable improvements.',
  },
];

const FEATURES = [
  { icon: FileText, title: 'Resume-tailored interviews', desc: 'Questions generated from your uploaded resume — skills, projects, and experience.' },
  { icon: Code2, title: 'Technical questions', desc: 'Role-relevant technical and system-design style questions based on your background.' },
  { icon: Users, title: 'Behavioral questions', desc: 'Situational and STAR-style prompts to practice structured storytelling.' },
  { icon: Bot, title: 'AI interview chat', desc: 'Answer questions in a focused chat flow, one at a time, just like a real interview.' },
  { icon: Target, title: 'AI scoring', desc: 'Each answer scored out of 10 with strengths, weaknesses, and suggestions.' },
  { icon: Star, title: 'STAR feedback', desc: 'Feedback highlights structure, clarity, and how well your answers land.' },
  { icon: History, title: 'Session history', desc: 'Every completed interview saved on your dashboard with full reports.' },
  { icon: BarChart3, title: 'Results analytics', desc: 'Per-question scores, dimension breakdowns, and an AI coach summary.' },
];

const INCLUDED = [
  {
    icon: Upload,
    title: 'Resume upload & parsing',
    desc: 'Upload a PDF resume and start a mock interview tied to your profile.',
  },
  {
    icon: MessageSquare,
    title: 'Live practice sessions',
    desc: 'Work through AI-generated questions in a clean, distraction-free chat.',
  },
  {
    icon: Zap,
    title: 'Instant evaluation',
    desc: 'Receive scored feedback with actionable improvements after each session.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'How does AI Interview Coach tailor questions to my resume?',
    answer: 'We parse your uploaded PDF resume to extract skills, projects, and experience. Our AI then generates interview questions that reflect what a real recruiter would ask for your specific background.',
  },
  {
    question: 'Is my resume data kept private?',
    answer: 'Yes. Your resume and interview sessions are tied to your account and protected behind authentication. We do not share your data with third parties.',
  },
  {
    question: 'What types of interviews can I practice?',
    answer: 'You can practice technical, behavioral, and coding-style interviews. Questions adapt to your resume and can cover STAR-method scenarios, system design, and role-specific topics.',
  },
  {
    question: 'Do I need to pay to get started?',
    answer: 'You can start practicing for free. Create an account, upload your resume, and run your first mock interview in minutes.',
  },
  {
    question: 'How is feedback generated?',
    answer: 'After each session, our AI evaluates your answers across multiple dimensions including relevance, structure, technical accuracy, and communication — with actionable suggestions for improvement.',
  },
];

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden landing-mesh">
      {/* ── Navbar ── */}
      <nav
        className={`w-full px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
            AI
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Interview<span className="text-primary-600">Coach</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 rounded-lg hover:bg-primary-50/80 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all duration-200"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold bg-gradient-to-r from-slate-900 to-slate-800 text-white px-5 py-2.5 rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all duration-200 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            Sign up free
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm" onClick={closeMobileMenu}>
          <div
            className="absolute top-[60px] left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-2xl p-4 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link to="/login" onClick={closeMobileMenu} className="px-4 py-3 text-sm font-medium text-center text-slate-700 border border-slate-200 rounded-xl">
                Log in
              </Link>
              <Link to="/signup" onClick={closeMobileMenu} className="px-4 py-3 text-sm font-semibold text-center text-white bg-slate-900 rounded-xl">
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative w-full pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-blob pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl animate-blob-slow pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-slate-700 text-sm font-medium mb-8 animate-fade-up">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span>AI-Powered Interview Preparation</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6 animate-fade-up">
                Ace every interview with{' '}
                <span className="text-gradient">intelligent AI coaching</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-up">
                Upload your resume, practice realistic mock interviews, and receive instant scored feedback — the premium way to prepare for your dream role.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up">
                <Link
                  to="/signup"
                  className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-2xl font-semibold shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                >
                  Start Practicing Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 glass text-slate-700 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 text-lg border border-slate-200/80"
                >
                  Log In to Dashboard
                </Link>
              </div>
            </div>

            {/* Right: AI illustration mockup */}
            <div className="relative animate-float hidden sm:block">
              <div className="relative glass rounded-3xl p-6 border border-white/60 shadow-2xl shadow-primary-500/10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">AI Interview Coach</p>
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live session
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="bg-slate-100/80 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 max-w-[90%]">
                    Tell me about a challenging technical problem you solved in your last role.
                  </div>
                  <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white max-w-[85%] ml-auto">
                    I architected a caching layer that reduced API latency by 40%...
                  </div>
                  <div className="bg-slate-100/80 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 max-w-[90%]">
                    Great start. How did you measure the impact?
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Clarity', score: '8.5' },
                    { label: 'STAR', score: '9.0' },
                    { label: 'Depth', score: '7.8' },
                  ].map((metric) => (
                    <div key={metric.label} className="bg-white/80 rounded-xl p-3 text-center border border-slate-100">
                      <p className="text-lg font-bold text-primary-600">{metric.score}</p>
                      <p className="text-xs text-slate-500">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating accent cards */}
              <div className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-3 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <p className="text-xs text-slate-500">Overall</p>
                <p className="text-2xl font-bold text-gradient">8.4/10</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What you get ── */}
      <section id="included" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100">
        <ScrollReveal className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">What You Get</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything in the app, honestly
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              No placeholder dashboards — upload your resume, practice, and review real AI feedback on your dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {INCLUDED.map((item) => (
              <div
                key={item.title}
                className="glass rounded-2xl p-6 border border-white/60 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Simple process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How it works</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              Four steps from resume upload to actionable interview feedback.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {HOW_IT_WORKS.map((item, index) => (
              <div key={item.title} className="relative group">
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-300 to-transparent" />
                )}
                <div className="glass rounded-2xl p-6 h-full border border-white/60 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-black text-slate-100 group-hover:text-primary-100 transition-colors">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="lg:hidden flex justify-center my-3">
                    <ChevronRight className="w-5 h-5 text-primary-400 rotate-90 sm:rotate-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 md:py-28 bg-white border-y border-slate-100">
        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              A complete AI interview preparation platform built for modern candidates.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-slate-50/80 hover:bg-white rounded-2xl p-5 border border-slate-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-primary-500 group-hover:to-blue-600 group-hover:text-white group-hover:border-transparent group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Dashboard Preview ── */}
      <section id="preview" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Product preview</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              See the platform in action
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              A glimpse of your dashboard, interview experience, and AI-powered feedback.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Dashboard mock */}
            <div className="glass rounded-2xl overflow-hidden border border-white/60 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-xs text-slate-400 ml-2">Dashboard</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="h-3 w-24 bg-slate-200 rounded-full" />
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Sessions', val: '—' },
                    { label: 'Avg Score', val: '—' },
                    { label: 'Questions', val: '—' },
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-white rounded-xl p-3 border border-slate-100 text-center">
                      <p className="text-lg font-bold text-primary-600">{val}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="border-2 border-dashed border-primary-200 rounded-xl p-6 text-center bg-primary-50/50">
                  <Upload className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Upload resume to start</p>
                </div>
              </div>
            </div>

            {/* Interview mock */}
            <div className="glass rounded-2xl overflow-hidden border border-white/60 shadow-xl hover:shadow-2xl transition-shadow duration-300 lg:-translate-y-4">
              <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-xs text-slate-400 ml-2">Interview</span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Question 3 of 8</span>
                  <span className="text-primary-600 font-medium">Technical</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[37%] bg-gradient-to-r from-primary-500 to-blue-600 rounded-full" />
                </div>
                <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-700 min-h-[80px]">
                  Explain how you would design a rate limiter for a distributed API.
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 min-h-[60px]">
                  <p className="text-xs text-slate-400">Your answer...</p>
                </div>
              </div>
            </div>

            {/* Feedback mock */}
            <AiFeedbackPanel
              overallScore={8.6}
              dimensions={[
                { label: 'Communication', score: 9 },
                { label: 'Technical', score: 8 },
                { label: 'Structure', score: 8 },
              ]}
              summaryFeedback="Strong STAR structure. Consider adding specific metrics."
              className="hover:shadow-2xl transition-shadow duration-300"
              animate={false}
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 md:py-28 bg-white border-t border-slate-100">
        <ScrollReveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          <FaqAccordion items={FAQ_ITEMS} />
        </ScrollReveal>
      </section>

      {/* ── Legal ── */}
      <section id="privacy-policy" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Privacy Policy</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your resume and interview sessions are stored securely and tied to your account. We do not sell or share your personal data with third parties. Data is used solely to generate interview questions and evaluate your responses within this application.
          </p>
        </div>
      </section>

      <section id="terms-of-service" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Terms of Service</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            AI Interview Coach is provided for educational and interview preparation purposes. AI-generated feedback is advisory and should not be treated as professional career counseling. By using this service, you agree to upload content you have the right to use.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-blue-600 to-indigo-700" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative px-8 py-14 sm:px-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Ready to ace your next interview?
              </h2>
              <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                Create a free account, upload your resume, and get AI-powered feedback in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-2xl font-semibold text-lg shadow-xl hover:bg-primary-50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Start Practicing Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/30 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                  AI
                </div>
                <span className="text-lg font-bold text-white">InterviewCoach</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                AI-powered mock interviews with resume-tailored questions and instant feedback.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors duration-200">How It Works</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#terms-of-service" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Connect</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors duration-200 inline-flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <p>&copy; {new Date().getFullYear()} AI Interview Coach. All rights reserved.</p>
            <p className="text-slate-500">
              Built by <span className="text-slate-300 font-medium">Gaurav Chauhan</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
