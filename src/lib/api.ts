const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: "Erreur serveur" }));
    throw new Error(data.error || "Erreur serveur");
  }
  return res.json();
}

// Users
export async function fetchUsers() {
  const res = await fetch(`${API_URL}/api/users`, { headers: authHeaders() });
  return handleResponse<any[]>(res);
}

export async function createUser(data: {
  username: string;
  full_name: string;
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<any>(res);
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse<any>(res);
}

// Interventions
export async function fetchInterventions() {
  const res = await fetch(`${API_URL}/api/interventions`, { headers: authHeaders() });
  return handleResponse<any[]>(res);
}

export async function createIntervention(data: {
  full_name: string;
  problem_description: string;
  location: string;
  actions_taken: string;
  date_of_intervention: string;
  is_solved: boolean;
}) {
  const res = await fetch(`${API_URL}/api/interventions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<any>(res);
}
