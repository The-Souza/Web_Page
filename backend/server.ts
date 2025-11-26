import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.ts";
import accountRoutes from "./routes/account.routes.ts";
import dotenv from "dotenv";

dotenv.config();
// Carrega as variáveis de ambiente para process.env.

// Cria a aplicação Express
const app = express();

// Lê a porta definida no .env
const PORT = process.env.PORT;

// ===== Middlewares globais =====

app.use(cors());
// Permite chamadas externas ao backend (evita bloqueio CORS no frontend).

app.use(express.json());
// Habilita leitura de JSON no corpo das requisições.

app.use(express.urlencoded({ extended: true }));
// Habilita leitura de dados via formulário (URL-encoded).

// ===== Registro das rotas =====

app.use("/api/users", userRoutes);
// Todas as rotas de usuário ficarão em /api/users/*

app.use("/api/accounts", accountRoutes);
// Todas as rotas de contas ficarão em /api/accounts/*

// ===== Middleware para rotas inexistentes =====

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
// Se nenhuma rota anterior corresponder, devolve 404.

// ===== Middleware global de tratamento de erros =====

app.use(
  (
    err: Error,
    req: express.Request,
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

// ===== Inicia o servidor =====

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
// Executa o servidor e mostra no console em qual porta está rodando.
