import type { Destination, PriceRange } from './destination';

export interface AIRecommendation {
  id: string;
  destination: Destination;
  reason: string;
  matchScore: number;
  relatedTo?: string; // ID of the destination that triggered this recommendation
  type: 'complement' | 'alternative' | 'nearby';
}

export interface TripPlan {
  id: string;
  name: string;
  description: string;
  days: TripDay[];
  totalBudget: PriceRange;
  highlights: string[];
  generatedBy: 'ai' | 'user';
}

export interface TripDay {
  day: number;
  date?: Date;
  destinations: Destination[];
  meals: MealSuggestion[];
  accommodation?: Accommodation;
  notes: string;
}

export interface MealSuggestion {
  type: 'breakfast' | 'lunch' | 'dinner';
  name: string;
  description: string;
  location: string;
  priceRange: PriceRange;
}

export interface Accommodation {
  name: string;
  type: 'hotel' | 'hostal' | 'finca' | 'glamping';
  location: string;
  pricePerNight: number;
  rating: number;
}
