import type { Request } from "express";
import type { JwtPayload } from "./jwt.schema.js";

/**
 * Request extendido que carrega o usuário decodificado do JWT.
 * Usar esse tipo sempre que middleware authenticateJWT garantir presença do user.
 */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
