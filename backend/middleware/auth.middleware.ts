import { verifyToken } from "../utils/jwt.ts";
import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../models/authRequest.ts";

export function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.get('authorization');
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

