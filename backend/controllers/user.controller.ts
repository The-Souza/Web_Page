import type { Request, Response } from "express";
import { logBackend } from "../utils/logger.ts";
import * as userService from "../services/user.service.ts";

export const register = (req: Request, res: Response) => {
  const user = req.body;
  if (userService.exists(user.email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  userService.add(user);
  logBackend("CREATE ACCOUNT", { user });
  return res.json({ success: true });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = userService.authenticate(email, password);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  logBackend("LOGIN", { user: { name: user.name, email: user.email } });
  return res.json({ success: true });
};

export const resetPassword = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = userService.getUserEmail(email);
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.password === password) {
    return res
      .status(400)
      .json({ message: "New password cannot be the same as current" });
  }

  const updated = userService.updatePassword(email, password);
  logBackend("USER CHANGED PASSWORD", { user: updated });
  return res.json({ success: true });
};

export const checkUserExists = (req: Request, res: Response) => {
  const { email } = req.body;
  const exists = userService.exists(email);
  return res.json({ exists });
};
