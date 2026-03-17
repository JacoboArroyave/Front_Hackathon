// ============================================================
//  lib/store/trip-store.ts
//  Maneja el estado del planificador de viaje
//  Las recomendaciones ahora vienen del backend real
// ============================================================

import type {
  Destination,
  SelectedDestination,
  TripDetails,
  AIRecommendation,
} from '@/models';
import { getAccommodations, mapAccommodationToDestination } from '@/services/api';

type Listener = () => void;

interface TripState {
  selectedDestinations: SelectedDestination[];
  tripDetails: TripDetails | null;
  aiRecommendations: AIRecommendation[];
  currentStep: 'destinations' | 'details' | 'review';
  isLoading: boolean;
}

class TripStore {
  private state: TripState = {
    selectedDestinations: [],
    tripDetails: null,
    aiRecommendations: [],
    currentStep: 'destinations',
    isLoading: false,
  };

  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  getState(): TripState {
    return this.state;
  }

  // ── Calcular precio total del viaje ───────────────────────────────────────
  getTotalPrice(): number {
    return this.state.selectedDestinations.reduce((total, sd) => {
      const activitiesPrice = sd.selectedActivities.reduce(
        (sum, act) => sum + act.price,
        0
      );
      return total + sd.destination.priceRange.min * sd.travelers + activitiesPrice;
    }, 0);
  }

  // ── Agregar destino ────────────────────────────────────────────────────────
  addDestination(destination: Destination, travelers: number = 2): void {
    // Evita agregar el mismo destino dos veces
    if (this.state.selectedDestinations.some(sd => sd.destination.id === destination.id)) {
      return;
    }

    const newSelected: SelectedDestination = {
      destination,
      selectedDate: new Date(),
      selectedActivities: destination.activities.slice(0, 1),
      travelers,
      order: this.state.selectedDestinations.length + 1,
    };

    this.state = {
      ...this.state,
      selectedDestinations: [...this.state.selectedDestinations, newSelected],
    };

    this.notify();

    // Genera recomendaciones basadas en el destino recién agregado
    this.generateRecommendations(destination);
  }

  // ── Quitar destino ─────────────────────────────────────────────────────────
  removeDestination(destinationId: string): void {
    this.state = {
      ...this.state,
      selectedDestinations: this.state.selectedDestinations
        .filter(sd => sd.destination.id !== destinationId)
        .map((sd, index) => ({ ...sd, order: index + 1 })),
    };
    this.notify();
  }

  // ── Reordenar destinos ─────────────────────────────────────────────────────
  updateDestinationOrder(destinationId: string, newOrder: number): void {
    const destinations = [...this.state.selectedDestinations];
    const currentIndex = destinations.findIndex(
      sd => sd.destination.id === destinationId
    );
    const [removed] = destinations.splice(currentIndex, 1);
    destinations.splice(newOrder - 1, 0, removed);

    this.state = {
      ...this.state,
      selectedDestinations: destinations.map((sd, index) => ({
        ...sd,
        order: index + 1,
      })),
    };
    this.notify();
  }

  // ── Cambiar fecha de un destino ────────────────────────────────────────────
  updateDestinationDate(destinationId: string, date: Date): void {
    this.state = {
      ...this.state,
      selectedDestinations: this.state.selectedDestinations.map(sd =>
        sd.destination.id === destinationId ? { ...sd, selectedDate: date } : sd
      ),
    };
    this.notify();
  }

  setTripDetails(details: TripDetails): void {
    this.state = { ...this.state, tripDetails: details };
    this.notify();
  }

  setCurrentStep(step: TripState['currentStep']): void {
    this.state = { ...this.state, currentStep: step };
    this.notify();
  }

  setAIRecommendations(recommendations: AIRecommendation[]): void {
    this.state = { ...this.state, aiRecommendations: recommendations };
    this.notify();
  }

  isDestinationSelected(destinationId: string): boolean {
    return this.state.selectedDestinations.some(
      sd => sd.destination.id === destinationId
    );
  }

  clearTrip(): void {
    this.state = {
      selectedDestinations: [],
      tripDetails: null,
      aiRecommendations: [],
      currentStep: 'destinations',
      isLoading: false,
    };
    this.notify();
  }

  // ── Generar recomendaciones desde el backend ───────────────────────────────
  // Cuando el usuario agrega un destino, consultamos el backend por más
  // alojamientos y filtramos los que complementan bien la selección actual
  private async generateRecommendations(selectedDestination: Destination): Promise<void> {
    this.state = { ...this.state, isLoading: true };
    this.notify();

    try {
      // Trae todos los alojamientos del backend
      const accommodations = await getAccommodations();
      const allDestinations = accommodations.map(mapAccommodationToDestination);

      // IDs ya seleccionados para no recomendarlos de nuevo
      const selectedIds = new Set(
        this.state.selectedDestinations.map(sd => sd.destination.id)
      );
      selectedIds.add(selectedDestination.id);

      // Filtra: excluye los ya seleccionados y prioriza categoría diferente
      // (complementario es mejor que repetir la misma experiencia)
      const candidates = allDestinations
        .filter(d => !selectedIds.has(d.id))
        .sort((a, b) => {
          // Pone primero los de categoría diferente al destino seleccionado
          const aDiff = a.category !== selectedDestination.category ? -1 : 1;
          const bDiff = b.category !== selectedDestination.category ? -1 : 1;
          return aDiff - bDiff;
        });

      // Toma los 3 mejores candidatos como recomendaciones
      const recommendations: AIRecommendation[] = candidates
        .slice(0, 3)
        .map((dest, i) => ({
          id: `rec-${dest.id}-${i}`,
          destination: dest,
          reason: buildRecommendationReason(dest, selectedDestination),
          matchScore: 95 - i * 5,
          relatedTo: selectedDestination.id,
          type: 'complement' as const,
        }));

      this.state = {
        ...this.state,
        aiRecommendations: recommendations,
        isLoading: false,
      };
    } catch {
      // Si falla el backend, simplemente no muestra recomendaciones
      this.state = {
        ...this.state,
        aiRecommendations: [],
        isLoading: false,
      };
    }

    this.notify();
  }
}

// ─── Función auxiliar para construir el texto de recomendación ────────────────
function buildRecommendationReason(
  recommended: Destination,
  selected: Destination
): string {
  const categoryMessages: Record<string, string> = {
    cafetero: 'Complementa tu viaje con una auténtica experiencia cafetera.',
    naturaleza: 'Ideal para conectar con la naturaleza del Eje Cafetero.',
    termalismo: 'Relájate después de tus actividades en aguas termales naturales.',
    cultura: 'Enriquece tu viaje con la historia y patrimonio de la región.',
    aventura: 'Agrega adrenalina a tu itinerario con esta experiencia.',
    gastronomia: 'Descubre los sabores auténticos de la región cafetera.',
  };

  const message =
    categoryMessages[recommended.category] ||
    'Un destino que complementa perfectamente tu itinerario.';

  return `${message} A solo minutos de ${selected.location.municipality}.`;
}

// Exporta una única instancia — singleton
export const tripStore = new TripStore();
