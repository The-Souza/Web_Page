import { Router } from "express";
import {
  register,
  login,
  resetPassword,
  checkUserExists,
} from "../controllers/user.controller.ts";
import { sql } from "../utils/db.ts";

const router = Router();

/**
 * POST /users/register
 * Registra um novo usuário no sistema.
 * Responsável por criar o registro na tabela de usuários.
 */
router.post("/register", register);

/**
 * POST /users/login
 * Autentica o usuário e retorna token + dados básicos.
 */
router.post("/login", login);

/**
 * POST /users/reset-password
 * Inicia ou conclui o fluxo de redefinição de senha.
 */
router.post("/reset-password", resetPassword);

/**
 * POST /users/check-user-exists
 * Verifica se um email já está cadastrado para evitar duplicações.
 */
router.post("/check-user-exists", checkUserExists);

/**
 * GET /users/
 * Retorna a lista completa de usuários.
 * ⚠️ Rota usada para debug — não possui autenticação.
 * Retorna apenas dados públicos, sem senha.
 */
router.get("/", async (req, res) => {
  try {
    const users = await sql`
      SELECT id, name, email, address
      FROM users
    `;

    res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("❌ Error fetching users:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
