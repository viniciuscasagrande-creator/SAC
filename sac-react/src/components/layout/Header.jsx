import React from 'react';
import { SearchInput } from '../ui/SearchInput';
import { Bell, HelpCircle, ShieldCheck } from 'lucide-react';

export function Header({ searchQuery, onSearchChange }) {
  return (
    <header className="h-16 bg-[#1e2530] text-white flex items-center justify-between px-6 border-b border-slate-700/50 shrink-0 z-20">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3 w-80">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg tracking-tighter shadow-md">
          D<span className="text-amber-400">i</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight leading-none text-white">DiskIngressos</span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">Produtor Portal</span>
        </div>
      </div>

      {/* Central Search */}
      <div className="flex-1 max-w-xl px-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Pesquisa global (eventos, participantes, lotes, pedidos...)"
            className="w-full bg-[#2a3444] text-slate-100 placeholder-slate-400 text-xs px-4 py-2 pl-9 rounded-full border border-slate-600/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* User / Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/40 text-emerald-400 text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Produção Ativa</span>
        </div>

        <div className="flex items-center gap-3 pl-2 border-l border-slate-700">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-semibold text-slate-200">Vinicius Casagrande</span>
            <span className="text-[10px] text-slate-400">PRIME EVENTOS LTDA</span>
          </div>
          
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-md flex items-center justify-center text-white font-bold text-xs">
              VC
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#1e2530] rounded-full"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
