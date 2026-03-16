'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DestinationCard } from '@/components/destinations/destination-card';
import { AIRecommendations } from './ai-recommendations';
import { Search, Loader2 } from 'lucide-react';
import { fetchDestinations } from '@/lib/data/destinations';
import { useTrip } from '@/hooks/use-trip';
import type { Destination, DestinationCategory } from '@/lib/types';

const categories: { value: DestinationCategory | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'naturaleza', label: 'Naturaleza' },
  { value: 'cafetero', label: 'Café' },
  { value: 'termalismo', label: 'Termalismo' },
  { value: 'cultura', label: 'Cultura' },
  { value: 'aventura', label: 'Aventura' },
];

export function DestinationSelector() {
  // ── Estado local ───────────────────────────────────────────────────────────
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | 'todos'>('todos');

  const { addDestination, isDestinationSelected } = useTrip();

  // ── Cargar destinos del backend al montar el componente ────────────────────
  useEffect(() => {
    fetchDestinations()
      .then(data => setDestinations(data))
      .catch(() => setError('No se pudieron cargar los destinos.'))
      .finally(() => setIsLoading(false));
  }, []); // [] = solo se ejecuta una vez al montar

  // ── Filtrar destinos según búsqueda y categoría seleccionada ───────────────
  // useMemo evita recalcular el filtro en cada render si no cambiaron los datos
  const filteredDestinations = useMemo(() => {
    let filtered = destinations;

    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.location.municipality.toLowerCase().includes(query) ||
        d.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [destinations, selectedCategory, searchQuery]);

  const handleSelectDestination = (destination: Destination) => {
    if (!isDestinationSelected(destination.id)) {
      addDestination(destination, 2);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Buscador y filtros por categoría ──────────────────────────────── */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar destinos, actividades o municipios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        <Tabs
          value={selectedCategory}
          onValueChange={(v) => setSelectedCategory(v as DestinationCategory | 'todos')}
        >
          <TabsList className="bg-secondary/50 p-1 h-auto flex-wrap w-full justify-start">
            {categories.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ── Panel de recomendaciones de IA ────────────────────────────────── */}
      <AIRecommendations onAddDestination={handleSelectDestination} />

      {/* ── Estado de carga ───────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Cargando destinos...</span>
        </div>
      )}

      {/* ── Estado de error ───────────────────────────────────────────────── */}
      {!isLoading && error && (
        <div className="text-center py-12">
          <p className="text-destructive text-sm">{error}</p>
          <p className="text-muted-foreground text-xs mt-1">
            Verifica que el backend esté corriendo en localhost:8080
          </p>
        </div>
      )}

      {/* ── Lista de destinos ─────────────────────────────────────────────── */}
      {!isLoading && !error && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredDestinations.length} destino{filteredDestinations.length !== 1 ? 's' : ''} encontrado{filteredDestinations.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onSelect={handleSelectDestination}
              />
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron destinos con los filtros seleccionados.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
