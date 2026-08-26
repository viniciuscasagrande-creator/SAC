import React, { useState } from 'react';
import { EventFilters } from '../components/events/EventFilters';
import { EventGrid } from '../components/events/EventGrid';

export function EventsPage({ 
  events = [], 
  searchQuery = '', 
  onOpenDetails 
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'active' | 'inactive'

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
        onCompare={handleCompare}
      />

      <EventGrid
        events={filteredEvents}
        onOpenDetails={onOpenDetails}
      />
    </div>
  );
}

