import React from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrengthMeter = ({ password }) => {
  if (!password) return null;

  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.exec(password) !== null },
    { label: 'Number', pass: /[0-9]/.exec(password) !== null },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.exec(password) !== null },
  ];

  const score = checks.filter((c) => c.pass).length;

  const getStrengthInfo = () => {
    switch (score) {
      case 0:
      case 1:
        return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600', width: 'w-1/4' };
      case 2:
        return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600', width: 'w-2/4' };
      case 3:
        return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-600', width: 'w-3/4' };
      case 4:
        return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600', width: 'w-full' };
      default:
        return { label: '', color: 'bg-slate-200', text: 'text-slate-500', width: 'w-0' };
    }
  };

  const { label, color, text, width } = getStrengthInfo();

  return (
    <div className="mt-2 space-y-2 animate-in fade-in duration-200">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-slate-500">Password Strength:</span>
        <span className={`font-semibold ${text}`}>{label}</span>
      </div>

      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} ${width} transition-all duration-300 rounded-full`} />
      </div>

      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {checks.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1 text-[11px]">
            {item.pass ? (
              <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            ) : (
              <X className="w-3 h-3 text-slate-300 flex-shrink-0" />
            )}
            <span className={item.pass ? 'text-slate-700 font-medium' : 'text-slate-400'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
