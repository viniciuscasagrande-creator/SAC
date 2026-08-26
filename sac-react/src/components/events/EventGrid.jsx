import React from 'react';
import { EventCard } from './EventCard';

export function EventGrid({ events = [], onOpenDetails }) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
          ∅
        </div>
        <h3 className="text-base font-bold text-slate-800">Nenhum evento encontrado</h3>
        <p className="text-xs text-slate-500 mt-1">Ajuste os filtros de busca para visualizar outros resultados.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  );
}

