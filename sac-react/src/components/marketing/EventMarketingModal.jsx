import React, { useState } from 'react';
import { X, Play, Check, ShieldCheck, Copy, Code2 } from 'lucide-react';
import { FacebookIcon } from '../ui/Icons';
import { Button } from '../ui/Button';

export function EventMarketingModal({ event, isOpen, onClose, producerPixels = [], onSavePixelConfig }) {
  if (!isOpen || !event) return null;

  const [mode, setMode] = useState(event.pixel?.mode || 'library');
  const [pixelId, setPixelId] = useState(event.pixel?.id || '918273645019283');
  const [datasetId, setDatasetId] = useState('ds_meta_3130_prod');
  const [tokenCapi, setTokenCapi] = useState('EAAGNOk92ZAApX893130xProdutor');
  const [testOutput, setTestOutput] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestDispatch = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestOutput({
        status: "success",
        http_code: 200,
        meta_api_response: {
          events_received: 1,
          fbtrace_id: "FvK" + Math.random().toString(36).substring(2, 9).toUpperCase(),
          deduplication_mode: "browser_and_server_match",
          event_name: "Purchase",
          pixel_id: pixelId,
          event_id: "order_test_" + Math.floor(Math.random() * 90000 + 10000),
          event_custom_data: {
            currency: "BRL",
            value: 150.00,
            content_ids: ["#" + event.id],
            content_type: "product"
          }
        },
        timestamp: new Date().toISOString()
      });
      setIsTesting(false);
    }, 800);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSavePixelConfig?.(event.id, {
      id: pixelId,
      mode,
      datasetId,
      tokenCapi,
      name: mode === 'inherit' ? 'Pixel Principal Produtora (Padrão Global)' : (mode === 'library' ? 'Pixel Festivais & Cerveja' : 'Pixel Customizado')
    });
    alert(`✅ Vinculação do Meta Pixel salva para #${event.id} (${event.name})!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <FacebookIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Meta Pixel & Conversions API (CAPI)</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-slate-900/60 text-[10px] font-bold">#{event.id}</span>
                <span className="text-xs text-blue-100 font-medium truncate max-w-xs">{event.name}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-slate-50">
          {/* Live Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Qualidade Match</span>
              <strong className="text-lg font-bold text-emerald-600 mt-0.5 block">{event.pixel?.emq || '9.2/10'}</strong>
              <span className="text-[10px] text-slate-500">Excelente (CAPI)</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Deduplicação</span>
              <strong className="text-lg font-bold text-blue-600 mt-0.5 block">100%</strong>
              <span className="text-[10px] text-slate-500">Browser + Server</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Receita Pixel</span>
              <strong className="text-lg font-bold text-slate-900 mt-0.5 block">R$ {event.total}</strong>
              <span className="text-[10px] text-emerald-600 font-semibold">ROAS: 6.2x</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Conversão</span>
              <strong className="text-lg font-bold text-emerald-600 mt-0.5 block">{event.pixel?.conversion || '4,8%'}</strong>
              <span className="text-[10px] text-slate-500">CPA: R$ 4,80</span>
            </div>
          </div>

          {/* Scope Configuration */}
          <form onSubmit={handleSave} className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
              Configuração de Escopo & Herança
            </h4>

            <div className="space-y-2">
              <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${mode === 'inherit' ? 'border-blue-500 bg-blue-50/40' : 'border-slate-200 bg-slate-50'}`}>
                <input
                  type="radio"
                  name="pixelMode"
                  value="inherit"
                  checked={mode === 'inherit'}
                  onChange={() => {
                    setMode('inherit');
                    setPixelId('892341209384721');
                  }}
                  className="mt-0.5 text-blue-600"
                />
                <div className="text-xs">
                  <strong className="text-slate-900 block font-semibold">Herdar Pixel Padrão do Produtor</strong>
                  <span className="text-slate-500 text-[11px]">Usa automaticamente o Pixel Padrão Global (ID: 892341209384721).</span>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${mode === 'library' ? 'border-blue-500 bg-blue-50/40' : 'border-slate-200 bg-slate-50'}`}>
                <input
                  type="radio"
                  name="pixelMode"
                  value="library"
                  checked={mode === 'library'}
                  onChange={() => setMode('library')}
                  className="mt-0.5 text-blue-600"
                />
                <div className="text-xs flex-1">
                  <strong className="text-slate-900 block font-semibold">Selecionar da Biblioteca de Pixels do Produtor</strong>
                  <span className="text-slate-500 text-[11px] block mb-2">Vincule um Pixel existente já cadastrado na conta.</span>
                  
                  {mode === 'library' && (
                    <select
                      value={pixelId}
                      onChange={(e) => setPixelId(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg text-xs p-2 font-mono font-bold text-slate-800"
                    >
                      <option value="918273645019283">Pixel Festivais & Cerveja (918273645019283)</option>
                      <option value="392182049182390">Pixel Experiência Música e Natureza (392182049182390)</option>
                      <option value="772183904128471">Pixel Shows Teatrais & MPB (772183904128471)</option>
                      <option value="892341209384721">Pixel Principal Produtora (Padrão Global)</option>
                    </select>
                  )}
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${mode === 'custom' ? 'border-blue-500 bg-blue-50/40' : 'border-slate-200 bg-slate-50'}`}>
                <input
                  type="radio"
                  name="pixelMode"
                  value="custom"
                  checked={mode === 'custom'}
                  onChange={() => setMode('custom')}
                  className="mt-0.5 text-blue-600"
                />
                <div className="text-xs">
                  <strong className="text-slate-900 block font-semibold">Utilizar Pixel Customizado Exclusivo</strong>
                  <span className="text-slate-500 text-[11px]">Insira um ID exclusivo para este evento.</span>
                </div>
              </label>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Pixel ID *</label>
                <input
                  type="text"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-blue-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Dataset ID</label>
                <input
                  type="text"
                  value={datasetId}
                  onChange={(e) => setDatasetId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Token CAPI</label>
                <input
                  type="password"
                  value={tokenCapi}
                  onChange={(e) => setTokenCapi(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            {/* Test CAPI Button & Terminal output */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-blue-600" />
                  Diagnóstico & Teste CAPI ao Vivo
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestDispatch}
                  disabled={isTesting}
                  icon={Play}
                >
                  {isTesting ? 'Disparando...' : 'Disparar Teste CAPI'}
                </Button>
              </div>

              {testOutput && (
                <div className="p-3 bg-slate-900 rounded-lg font-mono text-[11px] text-emerald-400 overflow-x-auto">
                  <pre>{JSON.stringify(testOutput, null, 2)}</pre>
                </div>
              )}
            </div>

            {/* Footer Form */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="sm" icon={Check}>
                Salvar Vinculação no Evento
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
