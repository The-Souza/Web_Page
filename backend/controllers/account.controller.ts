import express from "express";
import * as accountService from "../services/account.service.ts";
import type { AuthenticatedRequest } from "../models/authRequest.ts";

/**
 * Helper para interpretar o query param "paid".
 * Converte "true" → true, "false" → false, qualquer outra coisa → undefined.
 * Usado para garantir validação consistente do filtro.
 */
function parsePaidParam(paidParam: string | undefined): boolean | undefined {
  if (paidParam === undefined) return undefined;
  if (paidParam === "true") return true;
  if (paidParam === "false") return false;
  return undefined;
}

/**
 * GET /api/accounts
 * Retorna todas as contas do sistema (não filtradas).
 * Usado normalmente para fins administrativos.
 */
export async function getAllAccounts(
  req: express.Request,
  res: express.Response
) {
  try {
    const accounts = await accountService.getAllAccounts();
    res.json(accounts);
  } catch (err) {
    console.error("❌ Error fetching all accounts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/accounts/user/:userId?paid=true/false
 * Retorna contas associadas a um userId opcionalmente filtradas por "paid".
 * Exemplo: /api/accounts/user/3?paid=true
 */
export async function getAccountsByUserId(
  req: express.Request,
  res: express.Response
) {
  try {
    const userId = parseInt(req.params.userId, 10);

    // Validação: userId precisa ser um número
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // Validação do parâmetro "paid"
    const paid = parsePaidParam(req.query.paid as string | undefined);
    if (req.query.paid !== undefined && paid === undefined) {
      return res.status(400).json({ error: "paid must be true or false" });
    }

    const accounts = await accountService.getAccountsByUserId(userId, paid);
    res.json(accounts);
  } catch (err) {
    console.error("❌ Error fetching accounts by userId:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/accounts/email/:email?paid=true/false
 * Função similar à anterior, mas busca usuários pelo email.
 */
export async function getAccountsByUserEmail(
  req: express.Request,
  res: express.Response
) {
  try {
    const { email } = req.params;

    // Validação: email é obrigatório
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const paid = parsePaidParam(req.query.paid as string | undefined);
    if (req.query.paid !== undefined && paid === undefined) {
      return res.status(400).json({ error: "paid must be true or false" });
    }

    const accounts = await accountService.getAccountsByUserEmail(email, paid);
    res.json(accounts);
  } catch (err) {
    console.error("❌ Error fetching accounts by email:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * PATCH /api/accounts/:id/paid
 * Atualiza o status "paid" de uma conta (true/false).
 * Utilizado principalmente para marcar contas como pagas.
 */
export async function updateAccountPaid(
  req: express.Request,
  res: express.Response
) {
  try {
    const { id } = req.params;
    const { paid } = req.body;

    // Validação: paid deve ser boolean
    if (typeof paid !== "boolean") {
      return res.status(400).json({ error: "paid must be boolean" });
    }

    await accountService.updateAccountPaid(Number(id), paid);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error updating account paid:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * POST /api/accounts/register-account
 * Registra uma nova conta associada ao usuário autenticado.
 * Depende de "req.user" que vem do middleware de autenticação.
 */
export async function registerAccount(
  req: AuthenticatedRequest,
  res: express.Response
) {
  try {
    const user = req.user;

    // Validação: usuário precisa estar autenticado
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Campos esperados no corpo da requisição
    const {
      address,
      accountType,
      year,
      month,
      consumption,
      days,
      value,
      paid,
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (
      !address ||
      !accountType ||
      year == null ||
      month == null ||
      consumption == null ||
      days == null ||
      value == null
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Criação da conta
    await accountService.addAccount({
      userId: user.id,
      userEmail: user.email,
      address,
      accountType,
      year,
      month,
      consumption,
      days,
      value,
      paid,
    });

    return res.json({
      success: true,
      message: "Account registered successfully",
    });
  } catch (err) {
    console.error("❌ Error registering account:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

/**
 * DELETE /api/accounts/:id
 * Deleta uma conta específica pelo ID.
 *
 * - O ID da conta é passado via URL params (`req.params.id`).
 * - Requer autenticação JWT (usando `req.user` do middleware `authenticateJWT`).
 * - Retorna um JSON com `{ success: true, message: "Account deleted successfully" }` em caso de sucesso.
 * - Valida se o ID é um número válido; caso contrário retorna 400.
 * - Captura erros inesperados e retorna 500.
 */
export async function deleteAccount(
  req: AuthenticatedRequest,
  res: express.Response
) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid account id" });

    await accountService.deleteAccount(id);

    return res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting account:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

/**
 * PATCH /api/accounts/:id
 * Atualiza dados gerais da conta (exceto paid isolado).
 * - Recebe o ID da conta via URL params.
 * - Recebe os campos a atualizar via corpo da requisição (JSON).
 * - Requer autenticação JWT.
 * - Retorna a conta atualizada em caso de sucesso.
 * - Valida se o ID é um número válido; caso contrário retorna 400.
 */
export async function updateAccount(
  req: AuthenticatedRequest,
  res: express.Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid account id" });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const updatedAccount = await accountService.updateAccount(id, req.body);

    return res.json({
      success: true,
      data: updatedAccount,
      message: "Account updated successfully",
    });
  } catch (err) {
    console.error("❌ Error updating account:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
