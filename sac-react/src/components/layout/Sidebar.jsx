import React from 'react';
import {
  LayoutDashboard,
  Building2,
  ScanFace,
  Ticket,
  Wallet,
  PlusCircle,
  CreditCard,
  Send,
  UserCheck,
  ShieldAlert,
  Menu,
  Megaphone,
  RotateCcw,
  Headset,
  Layers,
  ChevronDown,
  Plus,
  ArrowRightLeft
} from 'lucide-react';

export function Sidebar({ 
  currentTab = 'events', 
  onSelectTab, 
  marketingSubTab = 'overview', 
  onSelectMarketingSubTab 
}) {
  const [marketingExpanded, setMarketingExpanded] = React.useState(true);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'producer', label: 'Dados da Produtora', icon: Building2 },
    { id: 'facial', label: 'Status Faciais', icon: ScanFace },
    { id: 'events', label: 'Todos os Eventos', icon: Ticket, badge: '4', badgeColor: 'bg-blue-600' },
    { id: 'finance', label: 'Financeiro', icon: Wallet, badge: '3', badgeColor: 'bg-emerald-600' },
    { id: 'new_event', label: 'Novo Evento', icon: PlusCircle },
    { id: 'pos', label: 'Terminais POS', icon: CreditCard, badge: '633', badgeColor: 'bg-blue-500' },
    { id: 'marketing', label: 'Marketing & Analytics', icon: Megaphone, hasSubmenu: true },
    { id: 'remarketing', label: 'Remarketing', icon: RotateCcw, badge: '4', badgeColor: 'bg-purple-600' },
    { id: 'access', label: 'Gerenciar Acessos', icon: UserCheck },
    { id: 'refunds', label: 'Estornos', icon: ShieldAlert, badge: 'ERP', badgeColor: 'bg-amber-600' },
    { id: 'sac', label: 'Atendimento / SAC', icon: Headset, badge: 'Novo', badgeColor: 'bg-sky-500' }
  ];

  return (
    <aside className="w-[358px] bg-[#242b38] text-slate-300 flex flex-col shrink-0 border-r border-slate-700/50 select-none overflow-y-auto">
      <div className="p-4 flex-1">
        <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">
          Navegação Principal
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            if (item.hasSubmenu) {
              return (
                <div key={item.id} className="pt-1">
                  <button
                    onClick={() => {
                      onSelectTab?.('marketing');
                      setMarketingExpanded(!marketingExpanded);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-700/80 text-white shadow-xs'
                        : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-600 text-white font-bold">9</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${marketingExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Submenu Marketing */}
                  {marketingExpanded && (
                    <div className="mt-1 ml-4 pl-3 border-l border-slate-700/60 space-y-0.5">
                      <button
                        onClick={() => {
                          onSelectTab?.('marketing');
                          onSelectMarketingSubTab?.('overview');
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          currentTab === 'marketing' && marketingSubTab === 'overview'
                            ? 'bg-blue-600/20 text-blue-400 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        📊 Visão Geral Consolidada
                      </button>
                      <button
                        onClick={() => {
                          onSelectTab?.('marketing');
                          onSelectMarketingSubTab?.('pixels');
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          currentTab === 'marketing' && marketingSubTab === 'pixels'
                            ? 'bg-blue-600/20 text-blue-400 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🎯 Biblioteca de Pixels & Tags
                      </button>
                      <button
                        onClick={() => {
                          onSelectTab?.('marketing');
                          onSelectMarketingSubTab?.('analytics');
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          currentTab === 'marketing' && marketingSubTab === 'analytics'
                            ? 'bg-blue-600/20 text-blue-400 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        📈 Gráficos Analytics (GA4)
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab?.(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-700/80 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white ${item.badgeColor || 'bg-slate-600'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Quick Actions */}
      <div className="p-4 border-t border-slate-700/60 bg-[#1c222e] space-y-2">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          Criar Novo Evento
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer border border-slate-600/40">
          <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
          Solicitar Repasse
        </button>
      </div>
    </aside>
  );
}
