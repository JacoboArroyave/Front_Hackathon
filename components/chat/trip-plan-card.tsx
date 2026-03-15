'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  DollarSign,
  ChevronRight,
  Sparkles,
  Check
} from 'lucide-react';
import type { TripPlan } from '@/lib/types';

interface TripPlanCardProps {
  plan: TripPlan;
}

export function TripPlanCard({ plan }: TripPlanCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="sticky top-24 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <Badge variant="secondary" className="text-xs">
            Plan generado por IA
          </Badge>
        </div>
        <CardTitle className="text-lg">{plan.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {plan.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Days Overview */}
        <div className="space-y-3">
          {plan.days.map((day) => (
            <div 
              key={day.day}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
                {day.day}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">
                  {day.destinations[0]?.name || 'Por definir'}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {day.destinations[0]?.location.municipality || 'Caldas'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Highlights */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Incluye
          </p>
          <div className="space-y-2">
            {plan.highlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Budget */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Presupuesto estimado</p>
            <p className="font-bold text-lg text-primary">
              {formatPrice(plan.totalBudget.min)} - {formatPrice(plan.totalBudget.max)}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-muted-foreground/30" />
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button className="w-full bg-primary hover:bg-primary/90" asChild>
            <Link href="/reservar">
              Reservar este Plan
              <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            Personalizar Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
