import type { CreateWorkerInput, Seniority, Worker } from "../models/worker.js";
import { workerRepo } from "../repositories/workerRepo.js";

function isValidSeniority(value: unknown): value is Seniority {
    return value === "junior" || value === "semi-senior" || value === "senior";
}

export const workerService = {
    create(input: CreateWorkerInput): Worker {
        const name = input?.name?.trim();
        const role = input?.role?.trim();
        const seniority = input?.seniority;

        if (!name) throw new Error("name is required");
        if (!role) throw new Error("role is required");
        if (!isValidSeniority(seniority)) throw new Error("seniority must be: junior | semi-senior | senior");

        return workerRepo.create({ name, role, seniority });
    },

    list(): Worker[] {
        return workerRepo.list();
    }
};