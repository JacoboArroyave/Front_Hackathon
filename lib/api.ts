// ============================================================
//  lib/api.ts
//  Puente central entre el frontend y el backend Spring Boot
//  Todos los fetch() del proyecto pasan por aquí
// ============================================================

// URL base del backend.
// En desarrollo apunta a localhost:8080
// En producción cambia esta variable en .env.local
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ─── Tipos que devuelve el backend ───────────────────────────────────────────

// Así llega un alojamiento desde GET /accommodations
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

// Lo que el frontend manda para crear una reserva
export interface ReservationRequest {
  accommodationId: number;
  userId: number;
  initialDate: string; // formato "YYYY-MM-DD"
  finalDate: string;   // formato "YYYY-MM-DD"
  attendees: number;
}

// Lo que el backend devuelve al crear/ver una reserva
export interface BackendReservation {
  reservationId: number;
  status: string;
  initialDate: string;
  finalDate: string;
  attendees: number;
  totalAmount: number;
  location: string;
}

// Lo que se manda al chat
export interface ChatRequest {
  message: string;
  sessionId?: string;
}

// Lo que devuelve el chat
export interface ChatResponse {
  reply: string;
  sessionId: string;
}

// ─── Función base para todos los fetch ───────────────────────────────────────
// Genérica con <T>: le decimos qué tipo de dato esperamos de vuelta
// Si el servidor responde con error (404, 500, etc.) lanza una excepción

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status} en ${path}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// ─── Accommodations ──────────────────────────────────────────────────────────

// Trae todos los alojamientos del backend
export async function getAccommodations(): Promise<BackendAccommodation[]> {
  return fetchAPI<BackendAccommodation[]>('/accommodations');
}

// Trae un alojamiento específico por su ID
export async function getAccommodationById(id: number): Promise<BackendAccommodation> {
  return fetchAPI<BackendAccommodation>(`/accommodations/${id}`);
}

// ─── Reservations ────────────────────────────────────────────────────────────

// Crea una nueva reserva
export async function createReservation(
  data: ReservationRequest
): Promise<BackendReservation> {
  return fetchAPI<BackendReservation>('/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Trae las reservas de un usuario
export async function getUserReservations(userId: number): Promise<BackendReservation[]> {
  return fetchAPI<BackendReservation[]>(`/reservations/user/${userId}`);
}

// Cancela una reserva
export async function cancelReservation(reservationId: number): Promise<BackendReservation> {
  return fetchAPI<BackendReservation>(`/reservations/${reservationId}/cancel`, {
    method: 'PUT',
  });
}

// ─── Chat / IA ───────────────────────────────────────────────────────────────

// Envía un mensaje al agente IA del backend
export async function sendChatMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  return fetchAPI<ChatResponse>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, sessionId } satisfies ChatRequest),
  });
}

// Limpia el historial de una sesión de chat en el backend
export async function clearChatSession(sessionId: string): Promise<void> {
  await fetchAPI(`/ai/chat/${sessionId}`, { method: 'DELETE' });
}

// ─── Mapper: BackendAccommodation → Destination (formato del frontend) ────────
// El backend devuelve accommodationId, cost, activities como string
// El frontend espera id, priceRange, activities como array de objetos
// Esta función hace esa traducción

import type { Destination, DestinationCategory } from '@/lib/types';

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

// Deduce la categoría del frontend según el tipo y actividades del backend
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
