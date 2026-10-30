import React from 'react';
import { Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-2xl bg-ivory-100/50 border border-dashed border-ivory-300">
      <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-serif font-bold text-teal-950 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-ivory-50 bg-teal-700 hover:bg-teal-800 transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

