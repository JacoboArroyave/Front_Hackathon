import type { Destination, Activity } from './destination';

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

export interface TravelerInfo {
  adults: number;
  children: number;
  infants: number;
}

export interface TravelPreferences {
  budget: 'economico' | 'moderado' | 'premium';
  pace: 'relajado' | 'moderado' | 'intenso';
  interests: Destination['category'][];
  accessibility: boolean;
  dietaryRestrictions?: string[];
}

export interface TripDetails {
  startDate: Date;
  endDate: Date;
  travelers: TravelerInfo;
  preferences: TravelPreferences;
}

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
