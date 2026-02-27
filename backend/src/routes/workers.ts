import { Router } from "express";
import { workerService } from "../services/workerService.js";

export const workersRouter = Router();

workersRouter.get("/", (_req, res) => {
    const workers = workerService.list();
    res.json(workers);
});

workersRouter.post("/", (req, res) => {
    try {
        const worker = workerService.create(req.body);
        res.status(201).json(worker);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ error: message });
    }
});