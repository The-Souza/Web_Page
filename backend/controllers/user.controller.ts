import pkg from "express";
import { logBackend } from "../utils/logger.ts";
import * as userService from "../services/user.service.ts";

export const register = async (req: pkg.Request, res: pkg.Response) => {
  try {
    const user = req.body;

    if (await userService.exists(user.email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    await userService.add(user);
    logBackend("CREATE ACCOUNT", { user });
    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Error in register:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: pkg.Request, res: pkg.Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticate(email, password);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    logBackend("LOGIN", { user: { name: user.name, email: user.email } });
    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Error in login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req: pkg.Request, res: pkg.Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserEmail(email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password === password) {
      return res
        .status(400)
        .json({ message: "New password cannot be the same as current" });
    }

    const updated = await userService.updatePassword(email, password);
    logBackend("USER CHANGED PASSWORD", { user: updated });
    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Error in resetPassword:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const checkUserExists = async (req: pkg.Request, res: pkg.Response) => {
  try {
    const { email } = req.body;
    const exists = await userService.exists(email);
    return res.json({ exists });
  } catch (err) {
    console.error("❌ Error in checkUserExists:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
