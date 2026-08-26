import React from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';

export function Header({ searchQuery, onSearchChange }) {
  return (
    <header className="h-[60px] bg-[#1e222a] text-white flex items-center justify-between px-6 border-b border-white/5 shrink-0 z-20">
      {/* Brand / Logo */}
      <div className="flex items-center gap-1.5 cursor-pointer">
        <span className="font-black italic text-2xl tracking-tighter text-white">Di</span>
        <span className="font-bold text-lg text-white tracking-tight">Diskingressos</span>
      </div>

      {/* Central Search */}
      <div className="flex-1 max-w-lg px-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Buscar eventos..."
            className="w-full bg-[#2b313d] text-slate-100 placeholder-slate-400 text-xs px-4 py-2 pl-9 pr-9 rounded-full border border-white/10 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all"
          />
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <SlidersHorizontal className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* User / Profile */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-xs">
            VI
          </div>
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-[#1e222a] rounded-full"></span>
        </div>
        <span className="text-xs font-medium text-slate-200 hidden sm:inline">vinicius.casagrande@diskingressos.com.br</span>
      </div>
    </header>
  );
}

