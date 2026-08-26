import React from 'react';
import { EventMetrics } from './EventMetrics';
import { MapPin, Calendar, Edit3, Settings, Share2 } from 'lucide-react';
import { FacebookIcon } from '../ui/Icons';

export function EventCard({ event, onOpenMarketing, onOpenDetails }) {
  return (
    <article className="flex flex-col md:flex-row min-h-[260px] overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-shadow">
      {/* 35% Left Image */}
      <div className="w-full md:w-[35%] min-w-[220px] relative bg-slate-900 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="h-48 md:h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-slate-950/80 text-white font-bold text-[10px] backdrop-blur-xs">
            #{event.id}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white font-bold text-[10px]">
            {event.status}
          </span>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex-1 p-5 md:p-6">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h2 className="text-lg md:text-[19px] font-bold text-slate-900 tracking-tight leading-tight">
                {event.name}
              </h2>

              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>

            <button
              onClick={() => onOpenMarketing?.(event)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold cursor-pointer transition-colors shrink-0"
              title="Configurar Meta Pixel do Evento"
            >
              <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Pixel Meta</span>
            </button>
          </div>

          <div className="my-5 border-t border-slate-200" />

          {/* 5 Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 lg:gap-6">
            <EventMetrics
              label="Total (R$)"
              value={event.total}
              accent="emerald"
            />

            <EventMetrics
              label="Vendas"
              value={event.sales}
              accent="blue"
            />

            <EventMetrics
              label="Disponível"
              value={event.available}
              accent="cyan"
            />

            <EventMetrics
              label="Cortesia"
              value={event.courtesy}
              accent="slate"
            />

            <EventMetrics
              label="Ocupação"
              value={`${event.occupancy}%`}
              accent="amber"
            />
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex h-13 items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 md:px-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{event.date}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <button
              onClick={() => onOpenMarketing?.(event)}
              className="sm:hidden flex items-center gap-1 text-xs text-blue-600 font-semibold cursor-pointer"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
              Pixel
            </button>
            <button 
              onClick={() => onOpenDetails?.(event)}
              className="p-1.5 hover:bg-slate-200/60 rounded-md text-slate-600 hover:text-slate-900 transition-colors cursor-pointer" 
              title="Editar Evento"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onOpenMarketing?.(event)}
              className="p-1.5 hover:bg-slate-200/60 rounded-md text-slate-600 hover:text-slate-900 transition-colors cursor-pointer" 
              title="Configurações & Tracking"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
