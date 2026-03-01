export const API_BASE_URL = "http://localhost:3001";

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
        },
        ...options
    });

  // Intenta parsear JSON siempre
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            (data && typeof data === "object" && "error" in data && String((data as any).error)) ||
            `Request failed (${res.status})`;
        throw new Error(message);
    }

    return data as T;
}