import React, { useState } from 'react';
import { PageLayout } from './components/layout/PageLayout';
import { EventsPage } from './pages/EventsPage';
import { MarketingPage } from './pages/MarketingPage';
import { EventMarketingModal } from './components/marketing/EventMarketingModal';
import { mockEvents } from './data/events';
import { mockProducerMarketing } from './data/marketing';

export default function App() {
  const [currentTab, setCurrentTab] = useState('events'); // 'events' | 'marketing' | 'dashboard' | 'finance' | ...
  const [marketingSubTab, setMarketingSubTab] = useState('overview'); // 'overview' | 'pixels' | 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Events state
  const [events, setEvents] = useState(mockEvents);
  
  // Marketing modal state
  const [selectedEventForPixel, setSelectedEventForPixel] = useState(null);
  const [isPixelModalOpen, setIsPixelModalOpen] = useState(false);

  const handleOpenMarketingModal = (event) => {
    setSelectedEventForPixel(event);
    setIsPixelModalOpen(true);
  };

  const handleCloseMarketingModal = () => {
    setIsPixelModalOpen(false);
    setSelectedEventForPixel(null);
  };

  const handleSavePixelConfig = (eventId, newPixelConfig) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          return {
            ...evt,
            pixel: {
              ...evt.pixel,
              ...newPixelConfig
            }
          };
        }
        return evt;
      })
    );
  };

  const handleOpenDetails = (event) => {
    alert(`🎟️ Detalhes do Evento #${event.id} - ${event.name}\nLocal: ${event.location}\nTotal: R$ ${event.total}\nOcupação: ${event.occupancy}%`);
  };

  return (
    <PageLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      marketingSubTab={marketingSubTab}
      onSelectMarketingSubTab={setMarketingSubTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {/* 1. TODOS OS EVENTOS (CARDS COM MÉTRICAS & PIXEL) */}
      {(currentTab === 'events' || currentTab === 'dashboard') && (
        <EventsPage
          events={events}
          searchQuery={searchQuery}
          onOpenMarketing={handleOpenMarketingModal}
          onOpenDetails={handleOpenDetails}
        />
      )}

      {/* 2. MARKETING & ANALYTICS (VISÃO CONSOLIDADA & BIBLIOTECA) */}
      {currentTab === 'marketing' && (
        <MarketingPage
          events={events}
          marketingSubTab={marketingSubTab}
          onSelectSubTab={setMarketingSubTab}
          onOpenEventPixel={handleOpenMarketingModal}
        />
      )}

      {/* 3. OUTROS PAINÉIS PLACEHOLDER / ESTORNOS */}
      {currentTab !== 'events' && currentTab !== 'dashboard' && currentTab !== 'marketing' && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
            ⚡
          </div>
          <h2 className="text-base font-bold text-slate-800 capitalize">Módulo {currentTab}</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Este módulo está pronto e integrado ao ecossistema DiskIngressos. Navegue para <strong>"Todos os Eventos"</strong> ou <strong>"Marketing & Analytics"</strong> para visualizar os cards e métricas.
          </p>
          <button
            onClick={() => setCurrentTab('events')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Voltar para Todos os Eventos
          </button>
        </div>
      )}

      {/* MODAL: META PIXEL & CAPI DO EVENTO */}
      <EventMarketingModal
        event={selectedEventForPixel}
        isOpen={isPixelModalOpen}
        onClose={handleCloseMarketingModal}
        producerPixels={mockProducerMarketing.producerPixels}
        onSavePixelConfig={handleSavePixelConfig}
      />
    </PageLayout>
  );
}
