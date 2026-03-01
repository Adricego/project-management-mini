import { api } from "./client";

export type Seniority = "junior" | "semi-senior" | "senior";

export interface Worker {
    id: string;
    name: string;
    role: string;
    seniority: Seniority;
}

export interface CreateWorkerInput {
    name: string;
    role: string;
    seniority: Seniority;
}

export function listWorkers() {
    return api<Worker[]>("/workers");
}

export function createWorker(input: CreateWorkerInput) {
    return api<Worker>("/workers", {
        method: "POST",
        body: JSON.stringify(input)
    });
}