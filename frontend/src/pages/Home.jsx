import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, Target, Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      
      {/* Navbar (Optional visual addition for Hero) */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold">AI</div>
          <span className="text-xl font-bold tracking-tight text-slate-800">InterviewCoach</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-primary-600 transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 hidden sm:block">Log in</Link>
          <Link to="/signup" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all shadow-sm">Sign up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-24 md:pt-32 md:pb-40 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-100/50 rounded-full blur-3xl -z-10 aspect-square"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl -z-10"></div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span>Voted #1 AI Interview Prep Tool in 2026</span>
        </div>
        
        {/* Headings */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mb-6">
          Nail your next interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">AI-driven</span> feedback.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
          Upload your resume, practice realistic technical and behavioral questions, and receive instant, actionable insights to land your dream job faster.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link 
            to="/signup" 
            className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold shadow-xl shadow-primary-500/20 hover:bg-primary-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
          >
            Start Practicing Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center text-lg"
          >
            Log In to Dashboard
          </Link>
        </div>

        {/* Social Proof */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center gap-6 justify-center w-full max-w-2xl">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Trusted By Candidates At</p>
          <div className="flex gap-6 opacity-60 grayscale">
            {/* Using text logos as placeholders for company logos */}
            <span className="font-bold text-xl tracking-tighter">Google</span>
            <span className="font-bold text-xl tracking-tighter">Microsoft</span>
            <span className="font-bold text-xl tracking-tight">Amazon</span>
            <span className="font-bold text-xl">Meta</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">Everything you need to succeed</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">Our platform combines industry-standard questions with state-of-the-art AI evaluation models.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Bot className="w-6 h-6"/>, title: "Hyper-Realistic AI", desc: "Our AI coach simulates real interviewer dynamics, adapting to your role and experience level dynamically." },
              { icon: <Target className="w-6 h-6"/>, title: "Actionable Feedback", desc: "Get detailed scoring on your STAR method delivery, technical accuracy, and tone immediately." },
              { icon: <ShieldCheck className="w-6 h-6"/>, title: "Resume Tailored", desc: "We parse your PDF resume line-by-line to ask the exact questions a real recruiter would ask." }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg hover:border-primary-100 group transition-all duration-300">
                <div className="w-12 h-12 bg-white border border-slate-200 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-50 transition-all duration-300 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
