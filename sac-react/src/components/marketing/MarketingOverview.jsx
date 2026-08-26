import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  CheckCircle2, 
  DollarSign, 
  Percent, 
  Sliders, 
  Plus, 
  ShieldCheck, 
  Play, 
  ArrowUpRight, 
  Filter 
} from 'lucide-react';
import { FacebookIcon } from '../ui/Icons';
import { Button } from '../ui/Button';

export function MarketingOverview({ 
  marketingData, 
  events, 
  onOpenEventPixel, 
  onAddProducerPixel 
}) {
  const { kpis, funnel, producerPixels } = marketingData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Marketing & Analytics — Visão Geral Consolidada</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Painel Executivo</span>
          </div>
          <p className="text-xs text-slate-500">Métricas consolidadas de todos os 25 eventos com matriz de auditoria de Pixels e tracking.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onAddProducerPixel} icon={Plus}>
            Novo Pixel na Biblioteca
          </Button>
        </div>
      </div>

      {/* 6 Executive KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Eventos Ativos</span>
          <div className="mt-1 text-2xl font-black text-slate-900">{kpis.activeEvents}</div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> 100% monitorados
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Visualizações</span>
          <div className="mt-1 text-2xl font-black text-blue-600">{kpis.views}</div>
          <span className="text-[10px] text-slate-500 font-medium">PageView Total</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Checkouts</span>
          <div className="mt-1 text-2xl font-black text-amber-500">{kpis.checkouts}</div>
          <span className="text-[10px] text-slate-500 font-medium">InitiateCheckout</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Compras</span>
          <div className="mt-1 text-2xl font-black text-emerald-600">{kpis.purchases}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Vendas Aprovadas</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Receita Rastreada</span>
          <div className="mt-1 text-xl font-black text-slate-900">{kpis.revenue}</div>
          <span className="text-[10px] text-slate-500 font-medium">ROAS: {kpis.roas}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Taxa Conversão</span>
          <div className="mt-1 text-2xl font-black text-emerald-600">{kpis.conversionRate}</div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +0.4% vs média
          </span>
        </div>
      </div>

      {/* Funnel */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            Funil Geral de Conversão (Todos os Eventos da Produtora)
          </h2>
          <span className="text-xs text-slate-400 font-medium">Tempo Real</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {funnel.map((step, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">{step.label}</span>
              <strong className="text-base font-bold text-slate-900 mt-1 block">{step.value}</strong>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className={`${step.color} h-full rounded-full`} style={{ width: step.percentage }} />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block mt-1">{step.percentage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Events Performance Matrix */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Matriz de Rastreamento & Performance por Evento
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Acompanhe qual Pixel Meta está ativo e a taxa de conversão em tempo real.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Evento</th>
                <th className="py-3 px-4">Visualizações</th>
                <th className="py-3 px-4">Checkouts</th>
                <th className="py-3 px-4">Vendas</th>
                <th className="py-3 px-4">Receita</th>
                <th className="py-3 px-4">Taxa Conv.</th>
                <th className="py-3 px-4">Modo do Pixel</th>
                <th className="py-3 px-4 text-right">Configurar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[10px]">
                        #{evt.id}
                      </span>
                      <div>
                        <strong className="text-slate-900 block font-semibold">{evt.name}</strong>
                        <span className="text-slate-400 text-[10px]">{evt.city}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{evt.pixel?.pageViews || '18.400'}</td>
                  <td className="py-3 px-4 font-medium text-amber-600">{evt.pixel?.initiateCheckout || '2.890'}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{evt.sales}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">R$ {evt.total}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {evt.pixel?.conversion || '4,6%'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                      evt.pixel?.mode === 'inherit' 
                        ? 'bg-sky-100 text-sky-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {evt.pixel?.mode === 'inherit' ? 'Herdado Produtor' : 'Biblioteca'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenEventPixel?.(evt)}
                      className="px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
                    >
                      <FacebookIcon className="w-3 h-3 text-blue-600" />
                      Pixel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
