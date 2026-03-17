// ============================================================
//  services/accommodations.ts
//  Tipos y funciones para interactuar con /accommodations
//  Actualizado a la estructura real del backend
// ============================================================

import type { Destination, DestinationCategory } from '@/models';
import { fetchAPI } from './client';

// ─── Tipos que devuelve el backend real ──────────────────────────────────────
// Estructura: GET /accommodations → BackendAccommodation[]
// Cada accommodation pertenece a un Hotel (establecimiento)
// El hotel puede ser tipo HOTEL o FARMING_HOUSE

export interface BackendCity {
  id: number;
  name: string;
  description: string;
  department: string;
}

export interface BackendEvent {
  eventId: number;
  name: string;
  type: string;
  durationMinutes: number;
  eventDate: string | null;
  description: string;
}

export interface BackendHotel {
  hotelId: number;
  name: string;
  rating: number;
  phone: string;
  type: 'HOTEL' | 'FARMING_HOUSE';
  coffeeTour: boolean;
  birdSpecies: string | null;
  activities: string | null;   // string separado por comas: "senderismo, café"
  city: BackendCity;
  accommodations: BackendAccommodation[]; // otras habitaciones del mismo hotel
  events: BackendEvent[];
}

export interface BackendAccommodation {
  id: number;
  hotel: BackendHotel;
  cost: number;
  roomCapacity: number;
  totalBeds: number;
  totalBathrooms: number;
  description: string;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export async function getAccommodations(): Promise<BackendAccommodation[]> {
  return fetchAPI<BackendAccommodation[]>('/accommodations');
}

export async function getAccommodationById(id: number): Promise<BackendAccommodation> {
  return fetchAPI<BackendAccommodation>(`/accommodations/${id}`);
}

// ─── Mapper: BackendAccommodation → Destination (formato del frontend) ────────
// Traduce la estructura del backend al formato que esperan los componentes

export function mapAccommodationToDestination(acc: BackendAccommodation): Destination {
  const hotel = acc.hotel;
  const category = inferCategory(hotel.type, hotel.activities ?? '');

  // Convierte "senderismo, café, fogata" → ["senderismo", "café", "fogata"]
  const activitiesList = hotel.activities
    ? hotel.activities.split(',').map(a => a.trim()).filter(Boolean)
    : [];

  // Nombre del lugar: "Hotel Boutique Manizales — Habitación doble"
  // Para fincas usamos solo el nombre del hotel porque suele ser la finca completa
  const name = hotel.type === 'FARMING_HOUSE'
    ? hotel.name
    : `${hotel.name}`;

  return {
    id: String(acc.id),
    name,
    slug: name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')  // elimina tildes
      .replace(/\s+/g, '-')             // espacios → guiones
      .replace(/[^a-z0-9-]/g, ''),      // elimina caracteres especiales
    description: acc.description || '',
    shortDescription: acc.description
      ? acc.description.substring(0, 100) + '...'
      : '',
    category,
    location: {
      municipality: hotel.city.name,
      coordinates: { lat: 5.0689, lng: -75.5174 }, // coordenadas genéricas de Caldas
      altitude: 1800,
      climate: 'Templado - 18°C promedio',
    },
    images: [],
    priceRange: {
      min: acc.cost,
      max: Math.round(acc.cost * 1.3), // rango estimado
      currency: 'COP',
    },
    duration: { minHours: 1, maxHours: 24, recommended: 'Una noche' },
    // highlights: actividades del hotel + info de habitación
    highlights: [
      ...activitiesList.slice(0, 3),
      `${acc.roomCapacity} personas`,
      `${acc.totalBeds} cama(s)`,
    ].filter(Boolean),
    rating: hotel.rating ?? 4.5,
    reviewCount: 0,
    tags: [category, hotel.type === 'FARMING_HOUSE' ? 'finca' : 'hotel', hotel.city.name.toLowerCase()],
    isPopular: hotel.rating >= 4.5,
    // Convierte los eventos del hotel en actividades del frontend
    activities: hotel.events.length > 0
      ? hotel.events.map(event => ({
          id: String(event.eventId),
          name: event.name,
          description: event.description,
          duration: `${event.durationMinutes} min`,
          difficulty: 'facil' as const,
          included: [],
          price: acc.cost,
        }))
      : activitiesList.map((act, i) => ({
          id: `act-${acc.id}-${i}`,
          name: act,
          description: act,
          duration: '2-3 horas',
          difficulty: 'facil' as const,
          included: [],
          price: acc.cost,
        })),
  };
}

// Deduce la categoría del frontend según el tipo y actividades del hotel
function inferCategory(type: string, activities: string): DestinationCategory {
  const t = type.toUpperCase();
  const a = activities.toLowerCase();

  if (t === 'FARMING_HOUSE' || a.includes('café') || a.includes('cafe') || a.includes('catación')) {
    return 'cafetero';
  }
  if (a.includes('termal') || a.includes('spa') || a.includes('aguas')) return 'termalismo';
  if (a.includes('aves') || a.includes('avi') || a.includes('senderismo') || a.includes('montaña')) {
    return 'naturaleza';
  }
  if (a.includes('cultura') || a.includes('patrimonio') || a.includes('arquitectura')) {
    return 'cultura';
  }
  if (a.includes('aventura') || a.includes('rafting') || a.includes('extremo')) return 'aventura';

  return 'naturaleza';
}