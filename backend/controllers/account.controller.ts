import pkg from "express";
import * as accountService from "../services/account.service.ts";

function parsePaidParam(paidParam: string | undefined): boolean | undefined {
  if (paidParam === undefined) return undefined;
  if (paidParam === "true") return true;
  if (paidParam === "false") return false;
  return undefined;
}

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

    const paid = parsePaidParam(req.query.paid as string | undefined);
    if (req.query.paid !== undefined && paid === undefined) {
      return res.status(400).json({ error: "paid must be true or false" });
    }

    const accounts = await accountService.getAccountsByUserId(userId, paid);
    res.json(accounts);
  } catch (err) {
    console.error("❌ Error fetching accounts by userId:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAccountsByUserEmail(
  req: pkg.Request,
  res: pkg.Response
) {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const paid = parsePaidParam(req.query.paid as string | undefined);
    if (req.query.paid !== undefined && paid === undefined) {
      return res.status(400).json({ error: "paid must be true or false" });
    }

    const accounts = await accountService.getAccountsByUserEmail(email, paid);
    res.json(accounts);
  } catch (err) {
    console.error("❌ Error fetching accounts by email:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateAccountPaid(req: pkg.Request, res: pkg.Response) {
  try {
    const { id } = req.params;
    const { paid } = req.body;
    if (typeof paid !== "boolean") {
      return res.status(400).json({ error: "paid must be boolean" });
    }
    await accountService.updateAccountPaid(Number(id), paid);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error updating account paid:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
