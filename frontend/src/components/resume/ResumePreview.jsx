import React, { useMemo } from 'react';
import { Briefcase, FileText, GraduationCap, Layers, Sparkles } from 'lucide-react';
import { parseResumePreview } from '../../utils/parseResumePreview';

const SECTION_META = {
  skills: { label: 'Skills', icon: Sparkles, accent: 'text-violet-600 bg-violet-50 border-violet-100' },
  experience: { label: 'Experience', icon: Briefcase, accent: 'text-primary-600 bg-primary-50 border-primary-100' },
  education: { label: 'Education', icon: GraduationCap, accent: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  projects: { label: 'Projects', icon: Layers, accent: 'text-amber-600 bg-amber-50 border-amber-100' },
};

const ResumePreview = ({ fileName, extractedText }) => {
  const { sections, preview } = useMemo(
    () => parseResumePreview(extractedText),
    [extractedText]
  );

  if (!extractedText) return null;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-white/80">
        <FileText className="w-4 h-4 text-primary-600 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{fileName || 'Resume'}</p>
          <p className="text-xs text-slate-500">Extracted content preview</p>
        </div>
      </div>

      <div className="p-4">
        {sections ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(sections).map(([key, items]) => {
              const meta = SECTION_META[key];
              if (!meta || !items.length) return null;
              const Icon = meta.icon;

              return (
                <div key={key} className={`rounded-lg border p-3 ${meta.accent}`}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {meta.label}
                  </p>
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li key={item} className="text-sm text-slate-700 leading-snug line-clamp-2">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-100 p-4">
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{preview}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
