import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  Cpu,
  Users,
  MessageSquareQuote,
  Building2,
  Plus,
  X,
  Target
} from 'lucide-react';

const PROFESSIONS = [
  { id: 'Student', label: 'Student', icon: GraduationCap, desc: 'Enrolled in college/university' },
  { id: 'Fresher', label: 'Fresher', icon: Award, desc: 'Recent graduate entering workforce' },
  { id: 'Job Seeker', label: 'Job Seeker', icon: Target, desc: 'Actively searching for new roles' },
  { id: 'Working Professional', label: 'Working Professional', icon: Briefcase, desc: 'Currently employed professional' },
  { id: 'Career Switcher', label: 'Career Switcher', icon: Cpu, desc: 'Transitioning to a new field' },
  { id: 'Other', label: 'Other', icon: Users, desc: 'General interview preparation' },
];

const EXPERIENCE_LEVELS = ['Fresher', '0–2 Years', '2–5 Years', '5+ Years'];

const POPULAR_SKILLS = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'System Design',
  'SQL',
  'Docker',
  'Data Structures',
  'AWS',
];

const INTERVIEW_TYPES = [
  { id: 'Technical', label: 'Technical', icon: Code2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'HR', label: 'HR Interview', icon: Users, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'Behavioral', label: 'Behavioral', icon: MessageSquareQuote, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'Coding', label: 'Coding / DSA', icon: Cpu, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'System Design', label: 'System Design', icon: Building2, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { id: 'Mixed', label: 'Mixed Mode', icon: Sparkles, color: 'text-sky-600 bg-sky-50 border-sky-200' },
];

const SignupStepTwo = ({
  formData,
  onChange,
  onPrevStep,
  onSubmit,
  isLoading,
  isSuccessState,
}) => {
  const {
    profession = 'Working Professional',
    experienceLevel = '0–2 Years',
    currentRole = '',
    targetRole = '',
    skills = ['JavaScript', 'React'],
    interviewType = 'Technical',
    institution = '',
  } = formData;

  const [customSkillInput, setCustomSkillInput] = useState('');

  const handleProfessionSelect = (val) => {
    onChange({ target: { name: 'profession', value: val } });
  };

  const handleExperienceSelect = (val) => {
    onChange({ target: { name: 'experienceLevel', value: val } });
  };

  const handleInterviewTypeSelect = (val) => {
    onChange({ target: { name: 'interviewType', value: val } });
  };

  const toggleSkill = (skill) => {
    let updated;
    if (skills.includes(skill)) {
      updated = skills.filter((s) => s !== skill);
    } else {
      updated = [...skills, skill];
    }
    onChange({ target: { name: 'skills', value: updated } });
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange({ target: { name: 'skills', value: [...skills, trimmed] } });
      setCustomSkillInput('');
    }
  };

  if (isSuccessState) {
    return (
      <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Your AI Interview Coach is ready!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Setting up your personalized interview space and launching dashboard...
          </p>
        </div>
        <div className="flex justify-center pt-2">
          <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Step Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
            Step 2 of 2 — Career Profile
          </span>
          <span className="text-xs text-primary-600 font-bold">100% Complete</span>
        </div>
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-primary-600 w-full rounded-full transition-all duration-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Personalize your AI Coach</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Tell us about your target roles so your AI mock interviews are tailored for you.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 max-h-[62vh] overflow-y-auto pr-1">
        {/* 1. Profession Cards */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Profession <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PROFESSIONS.map((p) => {
              const Icon = p.icon;
              const isSelected = profession === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProfessionSelect(p.id)}
                  className={`select-card ${isSelected ? 'select-card-active' : ''}`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-primary-600' : 'text-slate-400'}`} />
                  <div className="overflow-hidden">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-primary-900' : 'text-slate-800'}`}>
                      {p.label}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">{p.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Experience Level Pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Experience Level <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {EXPERIENCE_LEVELS.map((exp) => {
              const isSelected = experienceLevel === exp;
              return (
                <button
                  key={exp}
                  type="button"
                  onClick={() => handleExperienceSelect(exp)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {exp}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 & 4. Current & Target Job Roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Current Role
            </label>
            <input
              type="text"
              name="currentRole"
              value={currentRole}
              onChange={onChange}
              placeholder="e.g. Frontend Developer"
              className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Target Job Role <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="targetRole"
              value={targetRole}
              onChange={onChange}
              placeholder="e.g. Software Engineer"
              required
              className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>

        {/* 5. Skills Tag Selector */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Primary Skills & Tech Stack
            </label>
            <span className="text-[10px] text-slate-400 font-medium">{skills.length} selected</span>
          </div>

          {/* Selected Tag Chips */}
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px] p-2 bg-slate-50/80 border border-slate-200 rounded-xl">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-800 rounded-lg text-xs font-semibold animate-in fade-in duration-150"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className="hover:text-rose-600 transition-colors ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <span className="text-xs text-slate-400 self-center">Select or add your key skills below</span>
            )}
          </div>

          {/* Popular Tag Quick Add Options */}
          <div className="flex flex-wrap gap-1 mb-2">
            {POPULAR_SKILLS.map((sk) => {
              const isSelected = skills.includes(sk);
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleSkill(sk)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                    isSelected
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {sk}
                </button>
              );
            })}
          </div>

          {/* Custom Tag Input */}
          <div className="flex gap-1.5">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              placeholder="Type custom skill (e.g. Next.js)..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCustomSkill(e);
              }}
              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={handleAddCustomSkill}
              className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* 6. Preferred Interview Type Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Preferred Interview Focus <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INTERVIEW_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = interviewType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleInterviewTypeSelect(type.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-primary-50 border-primary-600 ring-2 ring-primary-500/20 font-bold'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${type.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-xs ${isSelected ? 'text-primary-900 font-bold' : 'text-slate-700 font-medium'}`}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. College / Company */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            College / Organization <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            name="institution"
            value={institution}
            onChange={onChange}
            placeholder="e.g. Stanford University or Tech Corp"
            className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2 pt-3">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={isLoading}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Complete Account & Start</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupStepTwo;
