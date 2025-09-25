import pkg from "express";
import * as accountService from "../services/account.service.ts";

export async function getAllAccounts(req: pkg.Request, res: pkg.Response) {
  try {
    const accounts = await accountService.getAllAccounts();
    res.json(accounts);
  } catch (err) {
    console.error("❌ Error fetching all accounts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAccountsByUserId(req: pkg.Request, res: pkg.Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    const accounts = await accountService.getAccountsByUserId(userId);
    res.json(accounts);
  } catch (err) {
    console.error("❌ Error fetching accounts by userId:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAccountsByUserEmail(req: pkg.Request, res: pkg.Response) {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const accounts = await accountService.getAccountsByUserEmail(email);
    res.json(accounts);
  } catch (err) {
    console.error("❌ Error fetching accounts by email:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
