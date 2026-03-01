import { api } from "./client";

export function resetDemo() {
    return api<{ ok: boolean }>("/admin/reset", { method: "POST" });
}