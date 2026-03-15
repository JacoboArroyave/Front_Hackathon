'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  MessageCircle, 
  Route, 
  Lightbulb,
  ArrowRight,
  Bot,
  Map
} from 'lucide-react';

const features = [
  {
    icon: Lightbulb,
    title: 'Recomendaciones Inteligentes',
    description: 'Mientras construyes tu viaje, nuestra IA analiza tus preferencias y te sugiere destinos complementarios que harán tu experiencia única.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Route,
    title: 'Rutas Optimizadas',
    description: 'Organizamos automáticamente tus destinos para maximizar el tiempo y minimizar desplazamientos innecesarios.',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: MessageCircle,
    title: 'Asistente de Viaje Personal',
    description: 'Describe lo que buscas en tu viaje ideal y nuestro asistente IA creará un plan personalizado completo.',
    color: 'bg-sky-100 text-sky-700',
  },
];

export function AIFeaturesSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Potenciado por IA
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">
              Tu Viaje Perfecto, Diseñado por Inteligencia Artificial
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Nuestra tecnología de IA entiende tus preferencias y crea 
              experiencias de viaje únicas. Ya sea que busques aventura, 
              relajación o cultura, te guiamos hacia los mejores destinos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/chat">
                  <Bot className="mr-2 h-5 w-5" />
                  Hablar con el Asistente
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/reservar">
                  <Map className="mr-2 h-5 w-5" />
                  Construir mi Viaje
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Features Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-background"
              >
                <CardContent className="p-6 flex gap-5">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Preview */}
        <div className="mt-16">
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="bg-foreground text-background p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">Asistente Caldas Viaja</p>
                <p className="text-xs text-background/60">Siempre disponible para ayudarte</p>
              </div>
            </div>
            <CardContent className="p-6 bg-background">
              <div className="space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-md">
                    <p className="text-sm">
                      Quiero un viaje de 3 días con mi familia. Nos gusta la naturaleza 
                      y queremos probar el café local.
                    </p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3 max-w-lg">
                    <p className="text-sm text-foreground mb-3">
                      Tengo el plan perfecto para ustedes. Les propongo:
                    </p>
                    <ul className="text-sm text-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary">Día 1:</span>
                        <span>Valle de Cocora y tour cafetero en Hacienda Venecia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary">Día 2:</span>
                        <span>Termales de Santa Rosa de Cabal con spa familiar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-primary">Día 3:</span>
                        <span>Recorrido por Salamina y experiencia RECUCA</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="flex-1">
                  Modificar plan
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  Me encanta, reservar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
