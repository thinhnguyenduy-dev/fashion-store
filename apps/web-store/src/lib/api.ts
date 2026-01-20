const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  authenticated?: boolean;
}

export async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { authenticated = false, headers, ...rest } = options;
  
  const headersMap = new Headers(headers);
  headersMap.set('Content-Type', 'application/json');

  if (authenticated) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headersMap.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: headersMap,
    ...rest,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${response.statusText}`);
  }

  return response.json();
}
