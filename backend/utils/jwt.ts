import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JwtPayloadSchema, type JwtPayload } from "../models/jwt.schema.ts";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET!;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

/**
 * Gera um token JWT a partir do payload validado.
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verifica e valida um token JWT.
 * - Retorna o payload validado (tipado) ou null se inválido/expirado.
 * - Usa Zod para garantir que o payload tem os campos esperados.
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const parsed = JwtPayloadSchema.safeParse(decoded);

    if (!parsed.success) {
      // Log de debug (útil em dev)
      console.error("❌ Invalid JWT payload:", parsed.error.format());
      return null;
    }

    return parsed.data;
  } catch {
    // token inválido / expirado etc.
    return null;
  }
}
