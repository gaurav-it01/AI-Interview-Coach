import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FaqAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className={`rounded-2xl border transition-all duration-300 ${
              isOpen
                ? 'border-primary-200 bg-white shadow-lg shadow-primary-500/5'
                : 'border-slate-200/80 bg-white/60 hover:border-slate-300'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-slate-900 text-sm sm:text-base">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-primary-600' : ''
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 sm:px-6 pb-5 text-slate-600 text-sm sm:text-base leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
