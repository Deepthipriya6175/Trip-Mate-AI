import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    escalated: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  const labels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    escalated: 'Escalated',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70"></span>
      {labels[status] || status}
    </span>
  );
};

export const UrgencyBadge = ({ urgency }) => {
  const styles = {
    low: 'bg-slate-100 text-slate-700 border-slate-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider border ${styles[urgency] || 'bg-slate-100 text-slate-700'}`}>
      {urgency}
    </span>
  );
};

export const SentimentBadge = ({ sentiment, score }) => {
  const styles = {
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    neutral: 'bg-amber-50 text-amber-700 border-amber-200',
    negative: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[sentiment] || 'bg-slate-100 text-slate-700'}`}>
      <span className="capitalize mr-1">{sentiment}</span>
      {score !== undefined && <span className="opacity-75">({Math.round(score * 100)}%)</span>}
    </span>
  );
};

export const CategoryBadge = ({ category }) => {
  const formatted = (category || 'general').replace('_', ' ');
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-ivory-200 text-teal-900 border border-ivory-300 capitalize">
      {formatted}
    </span>
  );
};

