import React from 'react';
import { ArrowRightLeft, Columns, ChevronDown, Calendar, Star, CalendarX2 } from 'lucide-react';

export function EventFilters({
  activeFilter = 'all',
  onFilterChange,
  onCompare
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
        Eventos
      </h1>

      <div className="flex flex-wrap items-center gap-2">
        {/* Compare Button */}
        <button
          onClick={onCompare}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-xs text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Comparar</span>
        </button>

        {/* Horizontal Selector */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-xs text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Columns className="w-3.5 h-3.5 text-slate-500" />
          <span>Horizontal</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Filter Status Tabs */}
        <div className="flex p-1 bg-white border border-slate-200 rounded-lg text-xs font-medium gap-1 shadow-xs">
          <button
            onClick={() => onFilterChange?.('active')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'active'
                ? 'bg-sky-50 text-sky-600 border border-sky-400 font-bold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-slate-700" />
            <span>Ativos</span>
          </button>
          <button
            onClick={() => onFilterChange?.('inactive')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'inactive'
                ? 'bg-sky-50 text-sky-600 border border-sky-400 font-bold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <CalendarX2 className="w-3.5 h-3.5 text-slate-700" />
            <span>Inativos</span>
          </button>
          <button
            onClick={() => onFilterChange?.('all')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-sky-50 text-sky-600 border border-sky-400 font-bold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>Todos</span>
          </button>
        </div>
      </div>
    </div>
  );
}

