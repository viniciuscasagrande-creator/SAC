import React from 'react';

export function EventMetrics({ label, value, accent = 'blue' }) {
  const colors = {
    emerald: 'border-emerald-500 text-slate-900',
    blue: 'border-blue-500 text-slate-900',
    cyan: 'border-cyan-500 text-slate-900',
    slate: 'border-slate-400 text-slate-900',
    amber: 'border-amber-500 text-slate-900',
  };

  return (
    <div>
      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">
        {label}
      </span>

      <strong className="mt-1 block text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
        {value}
      </strong>

      <div
        className={`mt-2 w-12 border-b-2 ${
          colors[accent] || colors.blue
        }`}
      />
    </div>
  );
}
