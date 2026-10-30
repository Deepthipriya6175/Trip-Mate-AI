import React from 'react';
import { Globe } from 'lucide-react';

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
];

export const LanguageSelector = ({ currentLanguage, onLanguageChange, compact = false }) => {
  return (
    <div className="relative inline-flex items-center">
      <Globe className="w-4 h-4 text-teal-700 mr-1.5 pointer-events-none" />
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-ivory-100/90 text-teal-900 border border-ivory-300 rounded-lg text-xs font-medium py-1.5 pl-2 pr-7 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230e7382' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.35rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.2em 1.2em',
        }}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {compact ? lang.code.toUpperCase() : `${lang.label} (${lang.native})`}
          </option>
        ))}
      </select>
    </div>
  );
};

