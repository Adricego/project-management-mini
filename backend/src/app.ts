import express from "express";
import cors from "cors";
import { workersRouter } from "./routes/workers.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/workers", workersRouter);

app.get("/health", (_req, res) => {
    res.json({ ok: true });
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});