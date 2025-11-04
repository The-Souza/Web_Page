import { Router } from "express";
import {
  getAllAccounts,
  getAccountsByUserId,
  getAccountsByUserEmail,
  updateAccountPaid,
} from "../controllers/account.controller.ts";
import { authenticateJWT } from "../middleware/auth.middleware.ts";
import { registerAccount } from "../controllers/account.controller.ts";

const router = Router();

router.get("/", getAllAccounts);
router.get("/user/:userId", getAccountsByUserId);
router.get("/email/:email", getAccountsByUserEmail);
router.patch("/:id/paid", updateAccountPaid);
router.post("/register", authenticateJWT, registerAccount);

export default router;
