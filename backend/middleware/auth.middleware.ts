import { verifyToken } from "../utils/jwt.js";
import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../models/authRequest.js";

/**
 * authenticateJWT
 * - Lê Authorization header (Bearer token)
 * - Verifica/decodifica com verifyToken (que usa Zod)
 * - Em caso de sucesso popula req.user e chama next()
 * - Caso contrário responde 401
 */
export function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  req.user = payload;
  next();
}
