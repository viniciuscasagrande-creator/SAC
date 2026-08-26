import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  ListCheck,
  CalendarPlus,
  Layers,
  Wallet,
  LineChart,
  DollarSign,
  ArrowRightLeft,
  HandCoins,
  Receipt,
  Calculator,
  Landmark,
  FileSignature,
  Scale,
  CreditCard,
  Headset,
  MessageSquare,
  RotateCcw,
  Megaphone,
  PieChart,
  Target,
  BarChart3,
  Crosshair,
  QrCode,
  Tags,
  Share2,
  Boxes,
  Sliders,
  RefreshCw,
  ShoppingCart,
  Send,
  Users,
  TrendingUp,
  Shield,
  UserCheck,
  ClipboardList,
  ChevronDown
} from 'lucide-react';

export function Sidebar({ 
  currentTab = 'events', 
  onSelectTab
}) {
  const [openSections, setOpenSections] = useState({
    events: true,
    finance: false,
    sac: false,
    marketing: false,
    remarketing: false,
    admin: false
  });

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  return (
    <aside className="w-[240px] bg-[#222731] text-slate-300 flex flex-col shrink-0 border-r border-white/5 select-none overflow-y-auto h-screen">
      <div className="p-3 flex-1">
        {/* Navigation Header */}
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
          {/* DASHBOARD */}
          <button
            onClick={() => onSelectTab?.('dashboard')}
            className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-[#313745] text-white font-semibold'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            <span>Dashboard</span>
          </button>

          {/* DADOS DA PRODUTORA */}
          <button
            onClick={() => onSelectTab?.('producer')}
            className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              currentTab === 'producer'
                ? 'bg-[#313745] text-white font-semibold'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>Dados da Produtora</span>
          </button>

          {/* EVENTOS (EXPANSÍVEL) */}
          <div>
            <button
              onClick={() => toggleSection('events')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'events' || currentTab === 'event-details'
                  ? 'bg-[#313745] text-white font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-slate-400" />
                <span>Eventos</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections.events ? 'rotate-180 text-sky-400' : 'text-slate-500'}`} />
            </button>
            {openSections.events && (
              <div className="pl-6 ml-3 border-l border-white/10 space-y-0.5 mt-0.5">
                <button
                  onClick={() => onSelectTab?.('events')}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] transition-colors ${
                    currentTab === 'events' ? 'text-sky-400 font-semibold bg-sky-500/10' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ListCheck className="w-3.5 h-3.5" />
                  <span>Todos os Eventos</span>
                </button>
                <button
                  onClick={() => onSelectTab?.('create-event')}
                  className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Novo Evento</span>
                </button>
                <button
                  onClick={() => onSelectTab?.('lotes')}
                  className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Configurar Lotes</span>
                </button>
              </div>
            )}
          </div>

          {/* FINANCEIRO (EXPANSÍVEL) */}
          <div>
            <button
              onClick={() => toggleSection('finance')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'finance'
                  ? 'bg-[#313745] text-white font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4 text-slate-400" />
                <span>Financeiro</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections.finance ? 'rotate-180 text-sky-400' : 'text-slate-500'}`} />
            </button>
            {openSections.finance && (
              <div className="pl-6 ml-3 border-l border-white/10 space-y-0.5 mt-0.5">
                <button onClick={() => onSelectTab?.('finance')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <LineChart className="w-3.5 h-3.5" />
                  <span>Hub Financeiro</span>
                </button>
                <button onClick={() => onSelectTab?.('finance-balance')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Saldo Consolidado</span>
                </button>
                <button onClick={() => onSelectTab?.('finance-payout')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Solicitações de Repasse</span>
                </button>
                <button onClick={() => onSelectTab?.('finance-advance')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <HandCoins className="w-3.5 h-3.5" />
                  <span>Antecipações</span>
                </button>
                <button onClick={() => onSelectTab?.('finance-statement')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Extrato Detalhado</span>
                </button>
                <button onClick={() => onSelectTab?.('finance-expenses')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Despesas</span>
                </button>
                <button onClick={() => onSelectTab?.('finance-banks')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Contas Bancárias</span>
                </button>
                <button onClick={() => onSelectTab?.('finance-bordero')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <FileSignature className="w-3.5 h-3.5" />
                  <span>Borderô</span>
                </button>
                <button onClick={() => onSelectTab?.('finance-dre')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Negociações & DRE</span>
                </button>
              </div>
            )}
          </div>

          {/* TERMINAIS POS */}
          <button
            onClick={() => onSelectTab?.('pos')}
            className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              currentTab === 'pos'
                ? 'bg-[#313745] text-white font-semibold'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 text-slate-400" />
            <span>Terminais POS</span>
          </button>

          {/* ATENDIMENTO / SAC (EXPANSÍVEL) */}
          <div>
            <button
              onClick={() => toggleSection('sac')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'sac' || currentTab === 'refunds'
                  ? 'bg-[#313745] text-white font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Headset className="w-4 h-4 text-slate-400" />
                <span>Atendimento / SAC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-700/80 text-slate-300 font-bold">SAC</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections.sac ? 'rotate-180 text-sky-400' : 'text-slate-500'}`} />
              </div>
            </button>
            {openSections.sac && (
              <div className="pl-6 ml-3 border-l border-white/10 space-y-0.5 mt-0.5">
                <button
                  onClick={() => onSelectTab?.('sac')}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] transition-colors ${
                    currentTab === 'sac' ? 'text-sky-400 font-semibold bg-sky-500/10' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Fila de Chamados</span>
                </button>
                <button
                  onClick={() => onSelectTab?.('refunds')}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] transition-colors ${
                    currentTab === 'refunds' ? 'text-sky-400 font-semibold bg-sky-500/10' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Gestão de Estornos</span>
                </button>
              </div>
            )}
          </div>

          {/* MARKETING (EXPANSÍVEL) */}
          <div>
            <button
              onClick={() => toggleSection('marketing')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'marketing'
                  ? 'bg-[#313745] text-white font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Megaphone className="w-4 h-4 text-slate-400" />
                <span>Marketing</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections.marketing ? 'rotate-180 text-sky-400' : 'text-slate-500'}`} />
            </button>
            {openSections.marketing && (
              <div className="pl-6 ml-3 border-l border-white/10 space-y-0.5 mt-0.5">
                <button onClick={() => onSelectTab?.('marketing')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <PieChart className="w-3.5 h-3.5" />
                  <span>Visão Geral</span>
                </button>
                <button onClick={() => onSelectTab?.('mkt-campaigns')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Target className="w-3.5 h-3.5" />
                  <span>Campanhas</span>
                </button>
                <button onClick={() => onSelectTab?.('mkt-analytics')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics (GA4)</span>
                </button>
                <button onClick={() => onSelectTab?.('mkt-pixel')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Pixel & Conversão</span>
                </button>
                <button onClick={() => onSelectTab?.('mkt-utm')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UTMs & QR Codes</span>
                </button>
                <button onClick={() => onSelectTab?.('mkt-coupons')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Tags className="w-3.5 h-3.5" />
                  <span>Cupons</span>
                </button>
                <button onClick={() => onSelectTab?.('mkt-promoters')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Promoters</span>
                </button>
                <button onClick={() => onSelectTab?.('mkt-combos')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Combos</span>
                </button>
                <button onClick={() => onSelectTab?.('mkt-pixels-matrix')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Pixels & Tracking</span>
                </button>
              </div>
            )}
          </div>

          {/* REMARKETING (EXPANSÍVEL) */}
          <div>
            <button
              onClick={() => toggleSection('remarketing')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'remarketing'
                  ? 'bg-[#313745] text-white font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-slate-400" />
                <span>Remarketing</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections.remarketing ? 'rotate-180 text-sky-400' : 'text-slate-500'}`} />
            </button>
            {openSections.remarketing && (
              <div className="pl-6 ml-3 border-l border-white/10 space-y-0.5 mt-0.5">
                <button onClick={() => onSelectTab?.('rmk-carts')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Carrinhos Abandonados</span>
                </button>
                <button onClick={() => onSelectTab?.('rmk-broadcast')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Send className="w-3.5 h-3.5" />
                  <span>Disparos WhatsApp</span>
                </button>
                <button onClick={() => onSelectTab?.('rmk-crm')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <Users className="w-3.5 h-3.5" />
                  <span>Segmentação CRM</span>
                </button>
                <button onClick={() => onSelectTab?.('rmk-metrics')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Métricas & ROI</span>
                </button>
              </div>
            )}
          </div>

          {/* ADMINISTRAÇÃO (EXPANSÍVEL) */}
          <div>
            <button
              onClick={() => toggleSection('admin')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-[#313745] text-white font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>Administração</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections.admin ? 'rotate-180 text-sky-400' : 'text-slate-500'}`} />
            </button>
            {openSections.admin && (
              <div className="pl-6 ml-3 border-l border-white/10 space-y-0.5 mt-0.5">
                <button onClick={() => onSelectTab?.('admin-users')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Usuários & Permissões</span>
                </button>
                <button onClick={() => onSelectTab?.('admin-logs')} className="w-full flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white transition-colors">
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Logs de Auditoria</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
}
