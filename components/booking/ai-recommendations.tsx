'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, 
  Plus, 
  MapPin,
  TrendingUp,
  ThumbsUp
} from 'lucide-react';
import { useTrip } from '@/hooks/use-trip';
import { cn } from '@/lib/utils';
import type { Destination, AIRecommendation } from '@/lib/types';

interface AIRecommendationsProps {
  onAddDestination: (destination: Destination) => void;
}

export function AIRecommendations({ onAddDestination }: AIRecommendationsProps) {
  const { aiRecommendations, isLoading, selectedDestinations, isDestinationSelected } = useTrip();

  if (selectedDestinations.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            Analizando tu selección...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (aiRecommendations.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Recomendaciones de IA
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Basado en tu selección, te sugerimos estos destinos complementarios
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aiRecommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onAdd={() => onAddDestination(rec.destination)}
              isSelected={isDestinationSelected(rec.destination.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onAdd: () => void;
  isSelected: boolean;
}

function RecommendationCard({ recommendation, onAdd, isSelected }: RecommendationCardProps) {
  const { destination, reason, matchScore, type } = recommendation;

  const typeLabels = {
    complement: 'Complementa tu viaje',
    alternative: 'Alternativa',
    nearby: 'Cerca de tu ruta',
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className={cn(
        'group relative p-4 rounded-xl bg-background border transition-all duration-300',
        isSelected 
          ? 'border-primary/50 bg-primary/5' 
          : 'hover:shadow-md hover:border-primary/30'
      )}
    >
      {/* Match Score Badge */}
      <div className="absolute -top-2 -right-2">
        <Badge 
          className="bg-primary text-primary-foreground text-xs px-2 py-0.5"
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          {matchScore}% match
        </Badge>
      </div>

      <div className="flex gap-4">
        {/* Placeholder image */}
        <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Badge variant="outline" className="text-xs mb-1">
                {typeLabels[type]}
              </Badge>
              <h4 className="font-semibold text-sm line-clamp-1">
                {destination.name}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {destination.location.municipality}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {reason}
          </p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-medium text-primary">
              Desde {formatPrice(destination.priceRange.min)}
            </span>
            
            {isSelected ? (
              <Badge variant="secondary" className="text-xs">
                <ThumbsUp className="w-3 h-3 mr-1" />
                Agregado
              </Badge>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs hover:bg-primary hover:text-primary-foreground"
                onClick={onAdd}
              >
                <Plus className="w-3 h-3 mr-1" />
                Agregar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
