const API_URL = import.meta.env.VITE_API_URL || 'https://order-management-0qdb.onrender.com';

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.detail || 'Request failed');
  }

  return data;
}
