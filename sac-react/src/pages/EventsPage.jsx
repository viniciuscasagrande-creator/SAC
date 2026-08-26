import React, { useState } from 'react';
import { EventFilters } from '../components/events/EventFilters';
import { EventGrid } from '../components/events/EventGrid';

export function EventsPage({ 
  events = [], 
  searchQuery = '', 
  onOpenMarketing, 
  onOpenDetails 
}) {
  const [activeFilter, setActiveFilter] = useState('active'); // 'active' | 'inactive' | 'all'
  const [layout, setLayout] = useState('horizontal'); // 'horizontal' | 'grid'

  const filteredEvents = events.filter((evt) => {
    const matchesSearch = 
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.id.includes(searchQuery);

    if (!matchesSearch) return false;

    if (activeFilter === 'active') return evt.status === 'Ativo';
    if (activeFilter === 'inactive') return evt.status !== 'Ativo';
    return true;
  });

  const handleCompare = () => {
    alert(`📊 Comparando métricas de performance de ${filteredEvents.length} eventos selecionados.`);
  };

  return (
    <div>
      <EventFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        eventsCount={filteredEvents.length}
        layout={layout}
        onLayoutChange={setLayout}
        onCompare={handleCompare}
      />

      <EventGrid
        events={filteredEvents}
        layout={layout}
        onOpenMarketing={onOpenMarketing}
        onOpenDetails={onOpenDetails}
      />
    </div>
  );
}
