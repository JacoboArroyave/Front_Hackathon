// ============================================================
//  services/client.ts
//  Cliente HTTP básico para el backend.
// ============================================================

// URL base del backend.
// En desarrollo apunta a localhost:8080
// En producción cambia esta variable en .env.local
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Función genérica para hacer fetch al backend.
// Lanza una excepción si la respuesta no es 2xx.
export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status} en ${path}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
