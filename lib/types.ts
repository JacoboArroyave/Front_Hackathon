// Domain Types for Caldas Travel System
// Following Domain-Driven Design principles

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

// Reservation System Types
export interface Reservation {
  id: string;
  userId: string;
  status: ReservationStatus;
  destinations: SelectedDestination[];
  tripDetails: TripDetails;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ReservationStatus = 
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'cancelled';

export interface SelectedDestination {
  destination: Destination;
  selectedDate: Date;
  selectedActivities: Activity[];
  travelers: number;
  notes?: string;
  order: number;
}

export interface TripDetails {
  startDate: Date;
  endDate: Date;
  travelers: TravelerInfo;
  preferences: TravelPreferences;
}

export interface TravelerInfo {
  adults: number;
  children: number;
  infants: number;
}

export interface TravelPreferences {
  budget: 'economico' | 'moderado' | 'premium';
  pace: 'relajado' | 'moderado' | 'intenso';
  interests: DestinationCategory[];
  accessibility: boolean;
  dietaryRestrictions?: string[];
}

// AI Recommendation Types
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

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: AIRecommendation[];
  tripPlan?: TripPlan;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context: TravelPreferences;
  createdAt: Date;
}
