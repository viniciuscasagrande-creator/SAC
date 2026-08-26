import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Ticket,
  Wallet,
  CreditCard,
  Send,
  Shield,
  ArrowRightLeft
} from 'lucide-react';

export function Sidebar({ 
  currentTab = 'events', 
  onSelectTab
}) {
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'producer', label: 'Dados da Produtora', icon: Building2 },
    { id: 'events', label: 'Todos os Eventos', icon: Ticket },
    { id: 'finance', label: 'Financeiro', icon: Wallet },
    { id: 'pos', label: 'Terminais POS', icon: CreditCard },
    { id: 'messages', label: 'Mensagens', icon: Send },
    { id: 'admin', label: 'Administração', icon: Shield }
  ];

  return (
    <aside className="w-[240px] bg-[#222731] text-slate-300 flex flex-col shrink-0 border-r border-white/5 select-none overflow-y-auto">
      <div className="p-3 flex-1">
        {/* Navigation Header with toggle button */}
        <div className="flex items-center justify-between px-2 pb-3 pt-1">
          <span className="font-bold text-white text-base">Navegação</span>
          <button className="w-7 h-7 rounded-full bg-[#2b313d] hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer" title="Alternar">
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase px-2 mb-1">
          MENU PRINCIPAL
        </div>

        <nav className="space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab?.(item.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#313745] text-white font-semibold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

