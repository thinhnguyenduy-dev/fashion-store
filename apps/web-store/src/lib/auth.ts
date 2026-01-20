import { fetchApi } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: any;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return fetchApi<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const payload = {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: '', // Optional add
  };
  
  // Note: /auth/register in gateway calls identity service which expects snake_case if using raw grpc objects
  // but Gateway AuthController.register takes body and maps to rpc. 
  // Let's check api-gateway/auth.controller.ts again.
  // It expects { email, firstName, lastName, phone ... } (camelCase) based on my implementation block.
  
  return fetchApi<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function saveToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
}

export function getToken() {
   if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  }
}
