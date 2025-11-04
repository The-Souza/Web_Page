import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { JwtPayload } from "../models/jwt.types.ts";

dotenv.config();

const SECRET_KEY: jwt.Secret = process.env.JWT_SECRET || "your_secret_key_here";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(
    payload as object,
    SECRET_KEY as jwt.Secret,
    { expiresIn: EXPIRES_IN } as jwt.SignOptions
  );
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch {
    return null;
  }
}
