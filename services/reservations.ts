import { fetchAPI } from './client';

export interface ReservationRequest {
  accommodationId: number;
  userId: number;
  initialDate: string; // formato "YYYY-MM-DD"
  finalDate: string;   // formato "YYYY-MM-DD"
  attendees: number;
}

export interface BackendReservation {
  reservationId: number;
  status: string;
  initialDate: string;
  finalDate: string;
  attendees: number;
  totalAmount: number;
  location: string;
}

export async function createReservation(
  data: ReservationRequest
): Promise<BackendReservation> {
  return fetchAPI<BackendReservation>('/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getUserReservations(userId: number): Promise<BackendReservation[]> {
  return fetchAPI<BackendReservation[]>(`/reservations/user/${userId}`);
}

export async function cancelReservation(reservationId: number): Promise<BackendReservation> {
  return fetchAPI<BackendReservation>(`/reservations/${reservationId}/cancel`, {
    method: 'PUT',
  });
}
