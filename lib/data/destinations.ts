// ============================================================
//  lib/data/destinations.ts
//  Antes tenía 3 destinos hardcodeados (array estático)
//  Ahora trae los datos reales desde el backend
// ============================================================

import type { Destination } from '@/lib/types';
import { getAccommodations, mapAccommodationToDestination } from '@/lib/api';

// ─── Función principal ────────────────────────────────────────────────────────
// Trae TODOS los destinos del backend y los convierte al formato del frontend
// Los componentes llaman esta función con useEffect al montarse

export async function fetchDestinations(): Promise<Destination[]> {
  const accommodations = await getAccommodations();
  return accommodations.map(mapAccommodationToDestination);
}

// ─── Helpers (equivalentes a los originales pero async) ───────────────────────
// Los componentes que antes usaban destinations.find() ahora usan estas funciones

// Busca un destino por su ID
export async function getDestinationById(id: string): Promise<Destination | undefined> {
  const all = await fetchDestinations();
  return all.find(d => d.id === id);
}

// Filtra destinos por categoría
export async function getDestinationsByCategory(category: string): Promise<Destination[]> {
  const all = await fetchDestinations();
  return all.filter(d => d.category === category);
}

// Devuelve solo los destinos marcados como populares
export async function getPopularDestinations(): Promise<Destination[]> {
  const all = await fetchDestinations();
  return all.filter(d => d.isPopular);
}

// Busca destinos por texto libre (nombre, descripción, tags)
export async function searchDestinations(query: string): Promise<Destination[]> {
  const all = await fetchDestinations();
  const q = query.toLowerCase();
  return all.filter(
    d =>
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.tags.some(tag => tag.toLowerCase().includes(q))
  );
}