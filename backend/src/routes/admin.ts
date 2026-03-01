import { Router } from "express";
import { workerRepo } from "../repositories/workerRepo.js";
import { projectRepo } from "../repositories/projectRepo.js";

export const adminRouter = Router();

adminRouter.post("/reset", (_req, res) => {
    workerRepo.clear();
    projectRepo.clear();
    res.json({ ok: true });
});