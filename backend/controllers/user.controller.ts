import express from "express";
import { logData } from "../utils/logger.ts";
import * as userService from "../services/user.service.ts";
import type { User, PublicUser } from "../models/user.types.ts";
import { generateToken } from "../utils/jwt.ts";

// Utiliza a função interna do service para retornar dados seguros do usuário
const publicUser = userService.mapRecordToUserSafe;

/**
 * POST /api/auth/register
 * Registra um novo usuário no banco.
 * - Valida campos obrigatórios
 * - Garante que o usuário ainda não existe
 * - Grava o novo registro
 * - Retorna apenas os dados públicos do usuário
 */
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const user = req.body as User;

    // Validação dos campos mínimos necessários
    if (!user || !user.email || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Verifica se o email já está cadastrado
    if (await userService.exists(user.email)) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Cria o usuário no banco
    await userService.add(user);

    // Busca novamente para garantir dados atualizados
    const created = await userService.getUserEmail(user.email);
    const pub: PublicUser | null = publicUser(created);

    // Log de auditoria
    logData("CREATE ACCOUNT", { user: pub });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: pub,
    });
  } catch (err) {
    console.error("❌ Error in register:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/auth/login
 * Autentica um usuário:
 * - Valida email e senha
 * - Verifica credenciais
 * - Retorna dados públicos + token JWT
 */
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    // Validação inicial
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Autenticação via service
    const user = await userService.authenticate(email, password);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const pub = userService.mapRecordToUserSafe(user);

    // Geração do token JWT
    const token = generateToken({
      id: user.id!,
      email: user.email,
      name: user.name ?? undefined,
    });

    // Log de auditoria
    logData("USER LOGGED IN", { user: pub });

    return res.json({
      success: true,
      message: "Login successful",
      user: pub,
      token,
    });
  } catch (err) {
    console.error("❌ Error in login:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/auth/reset-password
 * Redefine a senha do usuário:
 * - Verifica se o email existe
 * - Garante que a nova senha é diferente da atual
 * - Atualiza a senha no banco
 */
export const resetPassword = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    // Validação básica
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Verifica se o usuário existe
    const user = await userService.getUserEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Evita que a senha seja igual à atual
    if (user.password === password) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as current",
      });
    }

    // Atualiza a senha
    const updated = await userService.updatePassword(email, password);
    const pub: PublicUser | null = publicUser(updated);

    logData("USER CHANGED PASSWORD", { user: pub });

    return res.json({
      success: true,
      message: "Password changed successfully",
      user: pub,
    });
  } catch (err) {
    console.error("❌ Error in resetPassword:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/auth/check-user
 * Verifica se um usuário existe com base no email.
 * - Retorna status 200 se encontrado
 * - Retorna 404 se não encontrado
 */
export const checkUserExists = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body as { email?: string };

    // Validação
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required", exists: false });
    }

    // Consulta no banco
    const exists = await userService.exists(email);

    if (exists) {
      return res.json({ success: true, exists: true, message: "User exists" });
    } else {
      return res
        .status(404)
        .json({ success: false, exists: false, message: "User not found" });
    }
  } catch (err) {
    console.error("❌ Error in checkUserExists:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      exists: false,
    });
  }
};
