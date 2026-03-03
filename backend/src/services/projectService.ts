import type { CreateProjectInput, Project } from "../models/project.js";
import { projectRepo } from "../repositories/projectRepo.js";
import { workerRepo } from "../repositories/workerRepo.js";

function isValidDate(value: unknown): value is string {
    if (typeof value !== "string") return false;
    // Validación simple ISO (YYYY-MM-DD)
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export const projectService = {
    create(input: CreateProjectInput): Project {
        const name = input?.name?.trim();
        const client = input?.client?.trim();

        if (!name) throw new Error("name is required");
        if (!client) throw new Error("client is required");
        if (!isValidDate(input?.startDate)) throw new Error("startDate must be YYYY-MM-DD");
        if (!isValidDate(input?.endDate)) throw new Error("endDate must be YYYY-MM-DD");

        // Validación básica de orden de fechas (lexicográfica funciona con YYYY-MM-DD)
        if (input.startDate > input.endDate) throw new Error("startDate must be <= endDate");

        return projectRepo.create({
            name,
            client,
            startDate: input.startDate,
            endDate: input.endDate,
            workerIds: []
        });
    },

    assignWorker(projectId: string, workerId: string): Project {
        const project = projectRepo.findById(projectId);
        if (!project) throw new Error("project not found");

        const worker = workerRepo.findById(workerId);
        if (!worker) throw new Error("worker not found");

        if (project.workerIds.includes(workerId)) {
            return project; // idempotente: no duplica
        }

        project.workerIds.push(workerId);
        return projectRepo.update(project);
    },

    listRaw(): Project[] {
        return projectRepo.list();
    }
};