'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DestinationCard } from '@/components/destinations/destination-card';
import { ArrowRight, Loader2 } from 'lucide-react';
import { fetchDestinations } from '@/lib/data/destinations';
import type { Destination, DestinationCategory } from '@/lib/types';

const categories: { value: DestinationCategory | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'naturaleza', label: 'Naturaleza' },
  { value: 'cafetero', label: 'Café' },
  { value: 'termalismo', label: 'Termalismo' },
  { value: 'cultura', label: 'Cultura' },
];

interface FeaturedDestinationsProps {
  onSelectDestination?: (destination: Destination) => void;
}

export function FeaturedDestinations({ onSelectDestination }: FeaturedDestinationsProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | 'todos'>('todos');

  // Carga los destinos del backend al montar el componente
  useEffect(() => {
    fetchDestinations()
      .then(data => setDestinations(data))
      .finally(() => setIsLoading(false));
  }, []);

  // Filtra por categoría — si es 'todos' muestra solo los populares
  const filteredDestinations = selectedCategory === 'todos'
    ? destinations.filter(d => d.isPopular)
    : destinations.filter(d => d.category === selectedCategory);

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
              Explora Caldas
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Destinos Destacados
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Descubre los lugares más increíbles del departamento de Caldas.
              Desde imponentes volcanes hasta acogedores pueblos cafeteros.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/destinos">
              Ver todos los destinos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Tabs de categorías */}
        <Tabs
          value={selectedCategory}
          onValueChange={(v) => setSelectedCategory(v as DestinationCategory | 'todos')}
          className="mb-10"
        >
          <TabsList className="bg-secondary/50 p-1 h-auto flex-wrap">
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

        {/* Spinner de carga */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Cargando destinos...</span>
          </div>
        )}

        {/* Grid de destinos */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.slice(0, 6).map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onSelect={onSelectDestination}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron destinos en esta categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
