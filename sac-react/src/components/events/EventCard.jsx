import React from 'react';
import { Compass, Calendar, Edit3, Layers } from 'lucide-react';

export function EventCard({ event, onOpenDetails }) {
  return (
    <article 
      onClick={() => onOpenDetails?.(event)}
      className="flex flex-row min-h-[230px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Left Image Box */}
      <div className="w-[38%] min-w-[160px] relative bg-slate-900 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="h-full w-full object-cover"
        />
        {/* Event ID Tag */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded bg-black/80 text-white font-bold text-[11px] tracking-wide">
            {event.imageTag || event.id}
          </span>
          {event.secondaryTag && (
            <span className="px-1.5 py-0.5 rounded bg-blue-600/85 text-white font-bold text-[11px] tracking-wide">
              {event.secondaryTag}
            </span>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-1 flex-col justify-between p-4 pl-5">
        <div>
          <h2 className="text-[14px] font-bold text-slate-900 leading-tight">
            {event.name}
          </h2>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-4">
            <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{event.location}</span>
          </div>

          {/* 5 Metrics Row */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-medium">Total (R$)</span>
              <span className="text-sm font-bold text-slate-900 leading-tight">{event.total}</span>
              <div className="w-6 h-[2px] rounded-full bg-blue-600 mt-1" />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-medium">Vendas</span>
              <span className="text-sm font-bold text-slate-900 leading-tight">{event.sales}</span>
              <div className="w-6 h-[2px] rounded-full bg-blue-600 mt-1" />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-medium">Disponível</span>
              <span className="text-sm font-bold text-slate-900 leading-tight">{event.available}</span>
              <div className="w-6 h-[2px] rounded-full bg-cyan-500 mt-1" />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-medium">Cortesia</span>
              <span className="text-sm font-bold text-slate-900 leading-tight">{event.courtesy}</span>
              <div className="w-6 h-[2px] rounded-full bg-slate-400 mt-1" />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-medium">Ocupação</span>
              <span className={`text-sm font-bold leading-tight ${event.occupancyColor || 'text-slate-900'}`}>
                {event.occupancy}%
              </span>
              <div className={`w-6 h-[2px] rounded-full mt-1 ${event.occupancyBar || 'bg-blue-600'}`} />
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{event.date}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                alert(`Configurações de Pixel Facebook / Meta CAPI para o evento: ${event.name} (#${event.id})`);
              }}
              className="text-[10px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
              title="Configurar Pixel Meta"
            >
              <span>Pixel Meta</span>
            </button>
            <Edit3 
              className="w-3.5 h-3.5 hover:text-slate-900 transition-colors cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails?.(event);
              }}
            />
            <Layers 
              className="w-3.5 h-3.5 hover:text-slate-900 transition-colors cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails?.(event);
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

