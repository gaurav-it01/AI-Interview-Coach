import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

const COUNTRIES = [
  { code: '+91', country: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '+1', country: 'United States', flag: '🇺🇸', iso: 'US' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
  { code: '+1', country: 'Canada', flag: '🇨🇦', iso: 'CA' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', iso: 'AU' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪', iso: 'AE' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', iso: 'SG' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', iso: 'JP' },
  { code: '+33', country: 'France', flag: '🇫🇷', iso: 'FR' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱', iso: 'NL' },
];

const CountryCodeSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === value) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700 min-w-[95px] justify-between focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      >
        <span className="flex items-center gap-1.5 truncate">
          <span>{selectedCountry.flag}</span>
          <span>{selectedCountry.code}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="relative mb-2">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary-500"
              autoFocus
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
            {filteredCountries.map((c, index) => {
              const isSelected = c.code === selectedCountry.code && c.country === selectedCountry.country;
              return (
                <button
                  key={`${c.iso}-${index}`}
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isSelected ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span>{c.flag}</span>
                    <span className="truncate">{c.country}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <span>{c.code}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary-600" />}
                  </span>
                </button>
              );
            })}
            {filteredCountries.length === 0 && (
              <div className="py-4 text-center text-xs text-slate-400">No country found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelect;
