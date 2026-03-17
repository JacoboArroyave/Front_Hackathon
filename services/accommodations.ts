import type { Destination, DestinationCategory } from '@/models';
import { fetchAPI } from './client';

export interface BackendAccommodation {
  accommodationId: number;
  type: 'HOTEL' | 'FARMING_HOUSE';
  name: string;
  location: string;
  cost: number;
  description: string;
  capacity: number;
  activities: string; // viene como string separado por comas: "senderismo, café"
  // campos extra de Hotel
  rating?: number;
  stars?: number;
  phone?: string;
  // campos extra de FarmingHouse
  coffeeTour?: boolean;
  birdSpecies?: string;
}

export async function getAccommodations(): Promise<BackendAccommodation[]> {
  return fetchAPI<BackendAccommodation[]>('/accommodations');
}

export async function getAccommodationById(id: number): Promise<BackendAccommodation> {
  return fetchAPI<BackendAccommodation>(`/accommodations/${id}`);
}

export function mapAccommodationToDestination(acc: BackendAccommodation): Destination {
  const category = inferCategory(acc.type, acc.activities);

  // Convierte "senderismo, café, termalismo" → ["senderismo", "café", "termalismo"]
  const activitiesList = acc.activities
    ? acc.activities.split(',').map(a => a.trim()).filter(Boolean)
    : [];

  return {
    id: String(acc.accommodationId),
    name: acc.name,
    slug: acc.name
      .toLowerCase()
      .normalize('NFD')                        // separa tildes
      .replace(/[\u0300-\u036f]/g, '')         // elimina tildes
      .replace(/\s+/g, '-')                    // espacios → guiones
      .replace(/[^a-z0-9-]/g, ''),             // elimina caracteres especiales
    description: acc.description || '',
    shortDescription: acc.description
      ? acc.description.substring(0, 100) + '...'
      : '',
    category,
    location: {
      municipality: acc.location.split(',')[0].trim(), // "Manizales, Caldas" → "Manizales"
      coordinates: { lat: 5.0689, lng: -75.5174 },    // coordenadas generales de Caldas
      altitude: 1800,
      climate: 'Templado - 18°C promedio',
    },
    images: [],
    priceRange: {
      min: acc.cost,
      max: Math.round(acc.cost * 1.5),  // rango estimado: 50% más que el costo base
      currency: 'COP',
    },
    duration: { minHours: 3, maxHours: 8, recommended: 'Día completo' },
    highlights: activitiesList.slice(0, 4), // primeras 4 actividades como highlights
    rating: acc.rating ?? 4.5,
    reviewCount: 0,
    tags: [category, ...activitiesList.slice(0, 2)],
    isPopular: true,
    // Convierte cada actividad string en un objeto Activity
    activities: activitiesList.map((act, i) => ({
      id: `act-${acc.accommodationId}-${i}`,
      name: act,
      description: act,
      duration: '2-3 horas',
      difficulty: 'facil' as const,
      included: [],
      price: acc.cost,
    })),
  };
}

function inferCategory(type: string, activities?: string): DestinationCategory {
  const t = (type || '').toUpperCase();
  const a = (activities || '').toLowerCase();

  if (t === 'FARMING_HOUSE' || a.includes('café') || a.includes('cafe') || a.includes('catación')) {
    return 'cafetero';
  }
  if (a.includes('termal') || a.includes('spa') || a.includes('aguas')) return 'termalismo';
  if (a.includes('avi') || a.includes('aves') || a.includes('senderismo') || a.includes('montaña')) {
    return 'naturaleza';
  }
  if (a.includes('cultura') || a.includes('patrimonio') || a.includes('arquitectura')) {
    return 'cultura';
  }
  if (a.includes('aventura') || a.includes('rafting') || a.includes('extremo')) return 'aventura';

  return 'naturaleza'; // categoría por defecto
}
