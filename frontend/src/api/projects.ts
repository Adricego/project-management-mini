import { api } from "./client";
import type { Worker } from "./workers";

export interface Project {
    id: string;
    name: string;
    client: string;
    startDate: string;
    endDate: string;
    workerIds: string[];
}

export interface CreateProjectInput {
    name: string;
    client: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
}

export interface ProjectWithWorkers {
    id: string;
    name: string;
    client: string;
    startDate: string;
    endDate: string;
    workers: Worker[];
}

export function listProjectsRaw() {
    return api<Project[]>("/projects");
}

export function listProjectsWithWorkers() {
    return api<ProjectWithWorkers[]>("/projects?include=workers");
}

export function createProject(input: CreateProjectInput) {
    return api<Project>("/projects", {
        method: "POST",
        body: JSON.stringify(input)
    });
}

export function assignWorker(projectId: string, workerId: string) {
    return api<Project>(`/projects/${projectId}/assign/${workerId}`, {
        method: "POST"
    });
}