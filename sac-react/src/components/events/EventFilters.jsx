import React from 'react';
import { SlidersHorizontal, LayoutGrid, ListFilter } from 'lucide-react';
import { Button } from '../ui/Button';

export function EventFilters({
  activeFilter = 'active',
  onFilterChange,
  eventsCount = 4,
  layout = 'horizontal',
  onLayoutChange,
  onCompare
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Eventos</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
            {eventsCount}
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gerencie lotes, vendas, métricas de conversão e configurações de tracking.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Compare Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onCompare}
          icon={SlidersHorizontal}
          className="font-semibold text-slate-700"
        >
          Comparar
        </Button>

        {/* Filter Status Tabs */}
        <div className="flex p-1 bg-slate-200/80 rounded-lg text-xs font-semibold">
          <button
            onClick={() => onFilterChange?.('active')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'active'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => onFilterChange?.('inactive')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'inactive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inativos
          </button>
          <button
            onClick={() => onFilterChange?.('all')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
        </div>

        {/* Layout Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLayoutChange?.(layout === 'horizontal' ? 'grid' : 'horizontal')}
          icon={LayoutGrid}
          className="text-slate-700"
        >
          {layout === 'horizontal' ? 'Horizontal' : 'Grade'}
        </Button>
      </div>
    </div>
  );
}
