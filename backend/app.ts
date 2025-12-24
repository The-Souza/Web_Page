import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.ts";
import accountRoutes from "./routes/account.routes.ts";

export const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Rotas =====
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);

// ===== 404 =====
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ===== Error handler =====
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❌ Unhandled error:", err);
    // Loga o erro no backend.

    res.status(500).json({ error: "Internal server error" });
    // Retorna resposta padrão para erros não tratados.

    next(err);
    // Passa o erro adiante (boa prática, mesmo que não tenha outro handler).
  }
);

export default app;
