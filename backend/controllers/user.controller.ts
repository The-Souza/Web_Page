import express from "express";
import { logData } from "../utils/logger.ts";
import * as userService from "../services/user.service.ts";
import type { User, PublicUser } from "../models/user.types.ts";
import { generateToken } from "../utils/jwt.ts";

const publicUser = userService.mapRecordToUserSafe;

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const user = req.body as User;

    if (!user || !user.email || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (await userService.exists(user.email)) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    await userService.add(user);

    const created = await userService.getUserEmail(user.email);
    const pub: PublicUser | null = publicUser(created);

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

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await userService.authenticate(email, password);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const pub = userService.mapRecordToUserSafe(user);
    const token = generateToken({
      id: user.id!,
      email: user.email,
      name: user.name ?? undefined,
    });

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

export const resetPassword = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await userService.getUserEmail(email);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.password === password) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as current",
      });
    }

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

export const checkUserExists = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body as { email?: string };

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required", exists: false });
    }

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
