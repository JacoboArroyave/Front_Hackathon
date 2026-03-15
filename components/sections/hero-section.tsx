'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, MapPin, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    alt: 'Paisaje montañoso del eje cafetero',
  },
  {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop',
    alt: 'Valle verde con montañas',
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop',
    alt: 'Montañas al atardecer',
  },
];

const stats = [
  { label: 'Destinos', value: '50+' },
  { label: 'Viajeros Felices', value: '10K+' },
  { label: 'Tours', value: '100+' },
];

export function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={image.url}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            index === currentImage ? 'opacity-100' : 'opacity-0'
          )}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <Badge className="mb-6 bg-primary/90 text-primary-foreground border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Recomendaciones con IA
          </Badge>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-background mb-6 text-balance leading-tight">
            Descubre el Corazón Cafetero de{' '}
            <span className="text-primary-foreground">Colombia</span>
          </h1>

          <p className="text-lg sm:text-xl text-background/80 mb-8 leading-relaxed max-w-xl">
            Planifica tu viaje perfecto al departamento de Caldas con 
            recomendaciones personalizadas de inteligencia artificial. 
            Paisajes únicos, café de clase mundial y experiencias inolvidables.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              asChild
            >
              <Link href="/reservar">
                <Calendar className="mr-2 h-5 w-5" />
                Planificar mi Viaje
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-background/10 backdrop-blur-sm border-background/30 text-background hover:bg-background/20 hover:text-background"
              asChild
            >
              <Link href="/chat">
                <Sparkles className="mr-2 h-5 w-5" />
                Hablar con IA
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-background">{stat.value}</p>
                <p className="text-sm text-background/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Search Box */}
      <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-lg flex-1">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Destino</p>
                  <p className="font-medium">Todos los destinos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-lg flex-1">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="font-medium">Elige tus fechas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-lg flex-1">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Viajeros</p>
                  <p className="font-medium">2 adultos</p>
                </div>
              </div>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90 w-full md:w-auto">
              Buscar Experiencias
            </Button>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              index === currentImage 
                ? 'bg-background h-8' 
                : 'bg-background/50 hover:bg-background/80'
            )}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
