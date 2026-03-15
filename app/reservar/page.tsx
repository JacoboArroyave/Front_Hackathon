import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DestinationSelector } from '@/components/booking/destination-selector';
import { TripBuilder } from '@/components/booking/trip-builder';

export const metadata = {
  title: 'Planifica tu Viaje | Caldas Viaja',
  description: 'Construye tu viaje perfecto al departamento de Caldas con recomendaciones personalizadas de IA.',
};

export default function ReservarPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Planifica tu Viaje
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Selecciona los destinos que te gustaría visitar y nuestra IA te recomendará 
              lugares complementarios para crear la experiencia perfecta.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Destination Selector */}
            <div className="lg:col-span-2">
              <DestinationSelector />
            </div>

            {/* Sidebar - Trip Builder */}
            <div className="lg:col-span-1">
              <TripBuilder />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
