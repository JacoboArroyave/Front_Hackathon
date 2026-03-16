'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DestinationCard } from '@/components/destinations/destination-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { fetchDestinations } from '@/lib/data/destinations';
import { useTrip } from '@/hooks/use-trip';
import type { Destination, DestinationCategory } from '@/lib/types';

const categories: { value: DestinationCategory | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'naturaleza', label: 'Naturaleza' },
  { value: 'cafetero', label: 'Experiencia Cafetera' },
  { value: 'termalismo', label: 'Termalismo' },
  { value: 'cultura', label: 'Cultura' },
  { value: 'aventura', label: 'Aventura' },
];

export default function DestinosPage() {
  // ── Estado local ───────────────────────────────────────────────────────────
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | 'todos'>('todos');

  const { addDestination, isDestinationSelected, selectedDestinations } = useTrip();

  // ── Cargar destinos del backend al montar la página ────────────────────────
  useEffect(() => {
    fetchDestinations()
      .then(data => setDestinations(data))
      .catch(() => setError('No se pudieron cargar los destinos. Verifica que el backend esté activo.'))
      .finally(() => setIsLoading(false));
  }, []);

  // ── Filtrar según búsqueda y categoría ────────────────────────────────────
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

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    fetchDestinations()
      .then(data => setDestinations(data))
      .catch(() => setError('No se pudieron cargar los destinos.'))
      .finally(() => setIsLoading(false));
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 pb-12 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Explora Todos los Destinos
            </h1>
            <p className="text-muted-foreground text-lg">
              Descubre la diversidad de experiencias que ofrece el departamento de Caldas.
              Desde majestuosos nevados hasta acogedores pueblos cafeteros.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="sticky top-16 z-30 bg-background border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar destinos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Tabs
              value={selectedCategory}
              onValueChange={(v) => setSelectedCategory(v as DestinationCategory | 'todos')}
            >
              <TabsList className="bg-secondary/50 p-1 h-auto flex-wrap">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    className="px-3 py-1.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Banner de destinos seleccionados */}
      {selectedDestinations.length > 0 && (
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground">
                  {selectedDestinations.length} destino{selectedDestinations.length !== 1 ? 's' : ''} seleccionado{selectedDestinations.length !== 1 ? 's' : ''}
                </Badge>
                <div className="hidden sm:flex items-center gap-2">
                  {selectedDestinations.slice(0, 3).map((sd) => (
                    <span key={sd.destination.id} className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {sd.destination.name}
                    </span>
                  ))}
                  {selectedDestinations.length > 3 && (
                    <span className="text-sm text-muted-foreground">
                      +{selectedDestinations.length - 3} más
                    </span>
                  )}
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href="/reservar">
                  Continuar con la reserva
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de destinos */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Cargando */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Cargando destinos...</p>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="text-center py-16">
              <p className="text-destructive font-medium mb-4">{error}</p>
              <Button variant="outline" onClick={handleRetry}>
                Reintentar
              </Button>
            </div>
          )}

          {/* Resultados */}
          {!isLoading && !error && (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                  {filteredDestinations.length} destino{filteredDestinations.length !== 1 ? 's' : ''} encontrado{filteredDestinations.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onSelect={handleSelectDestination}
                  />
                ))}
              </div>

              {filteredDestinations.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No se encontraron destinos</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Intenta ajustar los filtros o buscar con otros términos.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
