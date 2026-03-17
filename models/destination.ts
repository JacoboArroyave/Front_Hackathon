// Domain models for travel destinations

export type DestinationCategory =
  | 'naturaleza'
  | 'cultura'
  | 'aventura'
  | 'gastronomia'
  | 'termalismo'
  | 'cafetero';

export interface Location {
  municipality: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  altitude: number;
  climate: string;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: 'COP';
}

export interface Duration {
  minHours: number;
  maxHours: number;
  recommended: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'facil' | 'moderado' | 'dificil';
  included: string[];
  price: number;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: DestinationCategory;
  location: Location;
  images: string[];
  priceRange: PriceRange;
  duration: Duration;
  highlights: string[];
  rating: number;
  reviewCount: number;
  tags: string[];
  isPopular: boolean;
  activities: Activity[];
}
