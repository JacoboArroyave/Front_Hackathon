// Trip Builder Store - Using Observer Pattern for state management
import type { Destination, SelectedDestination, TripDetails, TravelerInfo, TravelPreferences, AIRecommendation } from '@/lib/types';

type Listener = () => void;

interface TripState {
  selectedDestinations: SelectedDestination[];
  tripDetails: TripDetails | null;
  aiRecommendations: AIRecommendation[];
  currentStep: 'destinations' | 'details' | 'review';
  isLoading: boolean;
}

// Singleton Store with Observer Pattern
class TripStore {
  private state: TripState = {
    selectedDestinations: [],
    tripDetails: null,
    aiRecommendations: [],
    currentStep: 'destinations',
    isLoading: false,
  };

  private listeners: Set<Listener> = new Set();

  // Observer Pattern: Subscribe
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all subscribers
  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  // Getters
  getState(): TripState {
    return this.state;
  }

  getSelectedDestinations(): SelectedDestination[] {
    return this.state.selectedDestinations;
  }

  getAIRecommendations(): AIRecommendation[] {
    return this.state.aiRecommendations;
  }

  getTotalPrice(): number {
    return this.state.selectedDestinations.reduce((total, sd) => {
      const activitiesPrice = sd.selectedActivities.reduce((sum, act) => sum + act.price, 0);
      return total + (sd.destination.priceRange.min * sd.travelers) + activitiesPrice;
    }, 0);
  }

  // Actions
  addDestination(destination: Destination, travelers: number = 2): void {
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
    this.generateRecommendations(destination);
  }

  removeDestination(destinationId: string): void {
    this.state = {
      ...this.state,
      selectedDestinations: this.state.selectedDestinations
        .filter(sd => sd.destination.id !== destinationId)
        .map((sd, index) => ({ ...sd, order: index + 1 })),
    };
    this.notify();
  }

  updateDestinationOrder(destinationId: string, newOrder: number): void {
    const destinations = [...this.state.selectedDestinations];
    const currentIndex = destinations.findIndex(sd => sd.destination.id === destinationId);
    const [removed] = destinations.splice(currentIndex, 1);
    destinations.splice(newOrder - 1, 0, removed);
    
    this.state = {
      ...this.state,
      selectedDestinations: destinations.map((sd, index) => ({ ...sd, order: index + 1 })),
    };
    this.notify();
  }

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
    this.state = {
      ...this.state,
      tripDetails: details,
    };
    this.notify();
  }

  setCurrentStep(step: TripState['currentStep']): void {
    this.state = {
      ...this.state,
      currentStep: step,
    };
    this.notify();
  }

  setAIRecommendations(recommendations: AIRecommendation[]): void {
    this.state = {
      ...this.state,
      aiRecommendations: recommendations,
    };
    this.notify();
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

  // AI Recommendation Generation (mock for now)
  private async generateRecommendations(selectedDestination: Destination): Promise<void> {
    this.state = { ...this.state, isLoading: true };
    this.notify();

    // Simulating AI recommendation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockRecommendations = this.getMockRecommendations(selectedDestination);
    
    this.state = {
      ...this.state,
      aiRecommendations: mockRecommendations,
      isLoading: false,
    };
    this.notify();
  }

  private getMockRecommendations(destination: Destination): AIRecommendation[] {
    // Strategy Pattern: Different recommendation strategies based on category
    const strategies: Record<string, () => AIRecommendation[]> = {
      naturaleza: () => [
        {
          id: 'rec-1',
          destination: { 
            id: 'termales-santa-rosa',
            name: 'Termales de Santa Rosa de Cabal',
            slug: 'termales-santa-rosa',
            description: 'Aguas termales naturales rodeadas de vegetación tropical.',
            shortDescription: 'Relájate después de tu aventura natural',
            category: 'termalismo',
            location: { municipality: 'Santa Rosa de Cabal', coordinates: { lat: 4.8694, lng: -75.6211 }, altitude: 1840, climate: 'Templado' },
            images: [],
            priceRange: { min: 50000, max: 180000, currency: 'COP' },
            duration: { minHours: 3, maxHours: 8, recommended: 'Medio día' },
            highlights: ['Cascada termal', 'Spa'],
            rating: 4.7,
            reviewCount: 3420,
            tags: ['relajación'],
            isPopular: true,
            activities: []
          },
          reason: 'Después de explorar la naturaleza, te recomendamos relajarte en las aguas termales. Está a solo 1 hora de distancia.',
          matchScore: 95,
          relatedTo: destination.id,
          type: 'complement',
        },
        {
          id: 'rec-2',
          destination: {
            id: 'hacienda-venecia',
            name: 'Hacienda Venecia',
            slug: 'hacienda-venecia',
            description: 'Finca cafetera tradicional con experiencia de café premium.',
            shortDescription: 'Descubre el café de especialidad',
            category: 'cafetero',
            location: { municipality: 'Manizales', coordinates: { lat: 4.9833, lng: -75.6167 }, altitude: 1500, climate: 'Templado' },
            images: [],
            priceRange: { min: 60000, max: 250000, currency: 'COP' },
            duration: { minHours: 3, maxHours: 24, recommended: '4 horas' },
            highlights: ['Tour del café', 'Catación'],
            rating: 4.8,
            reviewCount: 1120,
            tags: ['café'],
            isPopular: true,
            activities: []
          },
          reason: 'Complementa tu experiencia natural con la cultura cafetera. Tour de café con vistas panorámicas.',
          matchScore: 88,
          relatedTo: destination.id,
          type: 'complement',
        },
      ],
      termalismo: () => [
        {
          id: 'rec-3',
          destination: {
            id: 'cocora',
            name: 'Valle de Cocora',
            slug: 'cocora',
            description: 'Hogar de las palmas de cera más altas del mundo.',
            shortDescription: 'Las palmas de cera más altas del mundo',
            category: 'naturaleza',
            location: { municipality: 'Salento', coordinates: { lat: 4.6378, lng: -75.4875 }, altitude: 2400, climate: 'Frío' },
            images: [],
            priceRange: { min: 25000, max: 80000, currency: 'COP' },
            duration: { minHours: 4, maxHours: 7, recommended: '5-6 horas' },
            highlights: ['Palmas de cera', 'Senderismo'],
            rating: 4.9,
            reviewCount: 4200,
            tags: ['naturaleza'],
            isPopular: true,
            activities: []
          },
          reason: 'Antes de relajarte, una caminata por el Valle de Cocora es la combinación perfecta.',
          matchScore: 92,
          relatedTo: destination.id,
          type: 'complement',
        },
      ],
      cafetero: () => [
        {
          id: 'rec-4',
          destination: {
            id: 'salamina',
            name: 'Salamina - Pueblo Patrimonio',
            slug: 'salamina',
            description: 'Ciudad patrimonio con arquitectura colonial única.',
            shortDescription: 'Patrimonio de la humanidad',
            category: 'cultura',
            location: { municipality: 'Salamina', coordinates: { lat: 5.4068, lng: -75.4903 }, altitude: 1822, climate: 'Templado' },
            images: [],
            priceRange: { min: 30000, max: 120000, currency: 'COP' },
            duration: { minHours: 4, maxHours: 8, recommended: 'Día completo' },
            highlights: ['Arquitectura colonial', 'Balcones tallados'],
            rating: 4.8,
            reviewCount: 890,
            tags: ['cultura'],
            isPopular: true,
            activities: []
          },
          reason: 'Complementa tu experiencia cafetera con la rica historia y arquitectura de Salamina.',
          matchScore: 90,
          relatedTo: destination.id,
          type: 'complement',
        },
      ],
      cultura: () => [
        {
          id: 'rec-5',
          destination: {
            id: 'recuca',
            name: 'Recuca',
            slug: 'recuca',
            description: 'Experiencia inmersiva en la cultura cafetera.',
            shortDescription: 'Vive la cultura del café',
            category: 'cafetero',
            location: { municipality: 'Montenegro', coordinates: { lat: 4.5589, lng: -75.7500 }, altitude: 1200, climate: 'Templado' },
            images: [],
            priceRange: { min: 45000, max: 95000, currency: 'COP' },
            duration: { minHours: 3, maxHours: 5, recommended: '4 horas' },
            highlights: ['Recolección de café', 'Vestimenta típica'],
            rating: 4.9,
            reviewCount: 2150,
            tags: ['café'],
            isPopular: true,
            activities: []
          },
          reason: 'Después de explorar la cultura local, sumérgete en la tradición cafetera.',
          matchScore: 87,
          relatedTo: destination.id,
          type: 'complement',
        },
      ],
    };

    const strategy = strategies[destination.category] || strategies.naturaleza;
    return strategy();
  }
}

// Export singleton instance
export const tripStore = new TripStore();
