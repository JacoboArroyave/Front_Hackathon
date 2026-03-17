import { fetchAPI } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
}

export async function login(userLogin: LoginRequest): Promise<LoginResponse> {
  return fetchAPI<LoginResponse>('auth/login', {
    method: 'POST',
    body: JSON.stringify(userLogin),
  });
}
