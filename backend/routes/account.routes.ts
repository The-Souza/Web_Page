import { Router } from "express";
import {
  getAllAccounts,
  getAccountsByUserId,
  getAccountsByUserEmail,
  updateAccountPaid,
  registerAccount,
} from "../controllers/account.controller.ts";
import { authenticateJWT } from "../middleware/auth.middleware.ts";

const router = Router();

/**
 * GET /accounts/
 * Retorna todas as contas registradas no sistema.
 * Uso comum: área administrativa ou listagem geral.
 */
router.get("/", getAllAccounts);

/**
 * GET /accounts/user/:userId
 * Retorna contas pertencentes a um usuário específico via userId.
 */
router.get("/user/:userId", getAccountsByUserId);

/**
 * GET /accounts/email/:email
 * Retorna contas pelo e-mail do usuário.
 * Útil quando o frontend só conhece o email (ex.: Supabase Auth).
 */
router.get("/email/:email", getAccountsByUserEmail);

/**
 * PATCH /accounts/:id/paid
 * Atualiza apenas o campo "paid" da conta.
 * Respeita o princípio de responsabilidade única, alterando só 1 atributo.
 */
router.patch("/:id/paid", updateAccountPaid);

/**
 * POST /accounts/register
 * Cria uma nova conta.
 * Requer autenticação JWT para garantir que somente usuários válidos
 * possam registrar contas.
 */
router.post("/register", authenticateJWT, registerAccount);

export default router;
