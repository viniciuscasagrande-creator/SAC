import React, { useState } from 'react';
import { MarketingOverview } from '../components/marketing/MarketingOverview';
import { mockProducerMarketing } from '../data/marketing';
import { Button } from '../components/ui/Button';
import { FacebookIcon } from '../components/ui/Icons';
import { Plus, CheckCircle2, ShieldCheck, Sparkles, BarChart3 } from 'lucide-react';

export function MarketingPage({ 
  events = [], 
  marketingSubTab = 'overview', 
  onSelectSubTab, 
  onOpenEventPixel 
}) {
  const [producerPixels, setProducerPixels] = useState(mockProducerMarketing.producerPixels);

  const handleAddPixel = () => {
    const name = prompt("Nome do novo Pixel da Produtora:");
    if (!name) return;
    const pixelId = prompt("ID do Pixel (Meta):", "89234120938" + Math.floor(Math.random() * 9000));
    if (!pixelId) return;

    const newPixel = {
      id: pixelId,
      name,
      platform: "Meta",
      eventsCount: 0,
      isDefault: false,
      matchQuality: "9.2/10"
    };

    setProducerPixels((prev) => [newPixel, ...prev]);
    alert(`✅ Pixel "${name}" adicionado à Biblioteca do Produtor!`);
  };

  const handleSetDefault = (id) => {
    setProducerPixels((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.id === id
      }))
    );
    alert("🌟 Pixel definido como Padrão Global de Herança!");
  };

  return (
    <div className="space-y-6">
      {/* Marketing Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-200/80 rounded-xl max-w-fit text-xs font-semibold">
        <button
          onClick={() => onSelectSubTab?.('overview')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            marketingSubTab === 'overview'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
          Visão Geral Consolidada
        </button>

        <button
          onClick={() => onSelectSubTab?.('pixels')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            marketingSubTab === 'pixels'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />
          Biblioteca de Pixels & Tags
        </button>
      </div>

      {marketingSubTab === 'overview' ? (
        <MarketingOverview
          marketingData={{ ...mockProducerMarketing, producerPixels }}
          events={events}
          onOpenEventPixel={onOpenEventPixel}
          onAddProducerPixel={handleAddPixel}
        />
      ) : (
        <div className="space-y-6">
          {/* Producer Pixel Library Panel */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FacebookIcon className="w-5 h-5 text-blue-600" />
                  Nível 1 — Biblioteca Central de Pixels do Produtor
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cadastre seus Pixels uma única vez. Eles serão herdados pelos eventos ou vinculados sob demanda.
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={handleAddPixel} icon={Plus}>
                Cadastrar Novo Pixel
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nome do Pixel</th>
                    <th className="py-3 px-4">Plataforma</th>
                    <th className="py-3 px-4">Pixel ID</th>
                    <th className="py-3 px-4">Eventos Vinculados</th>
                    <th className="py-3 px-4">Match Quality</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {producerPixels.map((px) => (
                    <tr key={px.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {px.name}
                          {px.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              ★ Padrão Global
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-semibold text-[10px]">
                          {px.platform}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{px.id}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{px.eventsCount} eventos</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{px.matchQuality}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Ativo & CAPI
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!px.isDefault && (
                          <button
                            onClick={() => handleSetDefault(px.id)}
                            className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold cursor-pointer transition-colors"
                          >
                            Tornar Padrão
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
