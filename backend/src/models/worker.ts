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