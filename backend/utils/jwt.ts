import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { JwtPayload } from "../models/jwt.types.ts";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET as jwt.Secret;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;

export function generateToken(payload: JwtPayload): string {
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: EXPIRES_IN,
  } as jwt.SignOptions);
  console.log("🔐 Generated Token:", token);
  return token;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch {
    return null;
  }
}
