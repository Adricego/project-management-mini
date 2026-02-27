import type { Worker } from "../models/worker.js";

const workers = new Map<string, Worker>();
let counter = 1;

function nextId() {
    return `w_${counter++}`;
}

export const workerRepo = {
    create(data: Omit<Worker, "id">): Worker {
        const worker: Worker = { id: nextId(), ...data };
        workers.set(worker.id, worker);
        return worker;
    },

    findById(id: string): Worker | undefined {
        return workers.get(id);
    },

    list(): Worker[] {
        return Array.from(workers.values());
    }
};