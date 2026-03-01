import { Router } from "express";
import { projectService } from "../services/projectService.js";
import { workerRepo } from "../repositories/workerRepo.js";

export const projectsRouter = Router();

projectsRouter.get("/", (req, res) => {
    const include = String(req.query.include || "");
    const projects = projectService.listRaw();

    if (include === "workers") {
        const enriched = projects.map((p) => ({
        id: p.id,
        name: p.name,
        client: p.client,
        startDate: p.startDate,
        endDate: p.endDate,
        workers: p.workerIds
            .map((wid) => workerRepo.findById(wid))
            .filter(Boolean)
        }));
        return res.json(enriched);
    }

    return res.json(projects);
});

projectsRouter.post("/", (req, res) => {
    try {
        const project = projectService.create(req.body);
        res.status(201).json(project);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ error: message });
    }
});

projectsRouter.post("/:projectId/assign/:workerId", (req, res) => {
    try {
        const { projectId, workerId } = req.params;
        const project = projectService.assignWorker(projectId, workerId);
        res.json(project);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ error: message });
    }
});