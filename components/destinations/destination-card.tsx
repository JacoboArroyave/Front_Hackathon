'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Star, Heart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Destination } from '@/models';

interface DestinationCardProps {
  destination: Destination;
  variant?: 'default' | 'featured' | 'compact';
  onSelect?: (destination: Destination) => void;
}

const categoryLabels: Record<string, string> = {
  naturaleza: 'Naturaleza',
  cultura: 'Cultura',
  aventura: 'Aventura',
  gastronomia: 'Gastronomía',
  termalismo: 'Termalismo',
  cafetero: 'Experiencia Cafetera',
};

const categoryColors: Record<string, string> = {
  naturaleza: 'bg-emerald-100 text-emerald-800',
  cultura: 'bg-amber-100 text-amber-800',
  aventura: 'bg-orange-100 text-orange-800',
  gastronomia: 'bg-rose-100 text-rose-800',
  termalismo: 'bg-sky-100 text-sky-800',
  cafetero: 'bg-amber-100 text-amber-800',
};

export function DestinationCard({ 
  destination, 
  variant = 'default',
  onSelect 
}: DestinationCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const placeholderImage = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop`;

  if (variant === 'compact') {
    return (
      <Card 
        className="group overflow-hidden cursor-pointer hover:shadow-md transition-all"
        onClick={() => onSelect?.(destination)}
      >
        <CardContent className="p-4 flex gap-4">
          <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={imageError ? placeholderImage : destination.images[0] || placeholderImage}
              alt={destination.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {destination.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {destination.location.municipality}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium">{destination.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Desde {formatPrice(destination.priceRange.min)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className="group overflow-hidden border-0 shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageError ? placeholderImage : destination.images[0] || placeholderImage}
            alt={destination.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            aria-label={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isLiked ? 'fill-red-500 text-red-500' : 'text-foreground'
              )}
            />
          </button>

          <Badge className={cn('absolute top-4 left-4', categoryColors[destination.category])}>
            {categoryLabels[destination.category]}
          </Badge>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
            <h3 className="font-serif text-2xl font-bold mb-2 text-balance">
              {destination.name}
            </h3>
            <p className="text-sm text-background/80 flex items-center gap-1 mb-3">
              <MapPin className="h-4 w-4" />
              {destination.location.municipality}, Caldas
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{destination.rating}</span>
                  <span className="text-background/60 text-sm">
                    ({destination.reviewCount})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-background/80">
                  <Clock className="h-4 w-4" />
                  {destination.duration.recommended}
                </div>
              </div>
              <p className="text-lg font-bold">
                Desde {formatPrice(destination.priceRange.min)}
              </p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
            {destination.shortDescription}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {destination.highlights.slice(0, 3).map((highlight) => (
              <Badge key={highlight} variant="secondary" className="text-xs">
                {highlight}
              </Badge>
            ))}
          </div>
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => onSelect?.(destination)}
            >
              Agregar al Viaje
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/destinos/${destination.slug}`}>
                Ver Más
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={imageError ? placeholderImage : destination.images[0] || placeholderImage}
          alt={destination.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          aria-label={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              isLiked ? 'fill-red-500 text-red-500' : 'text-foreground'
            )}
          />
        </button>

        <Badge className={cn('absolute top-3 left-3', categoryColors[destination.category])}>
          {categoryLabels[destination.category]}
        </Badge>
      </div>

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {destination.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{destination.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
          <MapPin className="h-3 w-3" />
          {destination.location.municipality}
        </p>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {destination.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {destination.duration.recommended}
          </div>
          <p className="font-semibold text-primary">
            Desde {formatPrice(destination.priceRange.min)}
          </p>
        </div>

        <Button 
          className="w-full mt-4 bg-primary hover:bg-primary/90"
          onClick={() => onSelect?.(destination)}
        >
          Seleccionar
        </Button>
      </CardContent>
    </Card>
  );
}
