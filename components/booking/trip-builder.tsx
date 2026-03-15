'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MapPin, 
  Clock, 
  Trash2, 
  GripVertical, 
  Calendar,
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useTrip } from '@/hooks/use-trip';
import { cn } from '@/lib/utils';

export function TripBuilder() {
  const { 
    selectedDestinations, 
    totalPrice, 
    removeDestination,
    currentStep,
    setCurrentStep 
  } = useTrip();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTotalDuration = () => {
    return selectedDestinations.reduce((total, sd) => {
      return total + sd.destination.duration.minHours;
    }, 0);
  };

  if (selectedDestinations.length === 0) {
    return (
      <Card className="sticky top-24 border-dashed">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Tu Viaje</h3>
          <p className="text-muted-foreground text-sm">
            Selecciona destinos para comenzar a construir tu viaje perfecto.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Tu Itinerario</CardTitle>
          <Badge variant="secondary">
            {selectedDestinations.length} destino{selectedDestinations.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="max-h-[400px]">
          <div className="p-4 space-y-3">
            {selectedDestinations.map((selected, index) => (
              <div
                key={selected.destination.id}
                className="group relative flex gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                {/* Order indicator */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  {index < selectedDestinations.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">
                    {selected.destination.name}
                  </h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {selected.destination.location.municipality}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selected.destination.duration.recommended}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {selected.travelers}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeDestination(selected.destination.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                  <span className="sr-only">Eliminar destino</span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        {/* Summary */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duración estimada</span>
            <span className="font-medium">{getTotalDuration()}+ horas</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Viajeros</span>
            <span className="font-medium">
              {selectedDestinations[0]?.travelers || 2} personas
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-medium">Total estimado</span>
            <span className="font-bold text-lg text-primary">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 pt-0 space-y-2">
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => setCurrentStep('details')}
          >
            Continuar
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            El precio final se confirmará al completar la reserva
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
