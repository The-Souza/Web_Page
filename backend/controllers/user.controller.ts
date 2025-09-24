import pkg from "express";
import { logData } from "../utils/logger.ts";
import * as userService from "../services/user.service.ts";

export const register = async (req: pkg.Request, res: pkg.Response) => {
  try {
    const user = req.body;

    if (await userService.exists(user.email)) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    await userService.add(user);
    logData("CREATE ACCOUNT", { user });

    return res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Error in register:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req: pkg.Request, res: pkg.Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticate(email, password);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    logData("LOGIN", { user: { name: user.name, email: user.email } });
    return res.json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error("❌ Error in login:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resetPassword = async (req: pkg.Request, res: pkg.Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserEmail(email);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.password === password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password cannot be the same as current",
        });
    }

    const updated = await userService.updatePassword(email, password);
    logData("USER CHANGED PASSWORD", { user: updated });

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("❌ Error in resetPassword:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const checkUserExists = async (req: pkg.Request, res: pkg.Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const exists = await userService.exists(email);

    if (exists) {
      return res.json({ success: true, exists, message: "User exists" });
    } else {
      return res
        .status(404)
        .json({ success: false, exists, message: "User not found" });
    }
  } catch (err) {
    console.error("❌ Error in checkUserExists:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
