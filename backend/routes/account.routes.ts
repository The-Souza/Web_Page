import { Router } from "express";
import {
  getAllAccounts,
  getAccountsByUserId,
  getAccountsByUserEmail,
} from "../controllers/account.controller.ts";

const router = Router();

router.get("/", getAllAccounts);
router.get("/user/:userId", getAccountsByUserId);
router.get("/email/:email", getAccountsByUserEmail);

export default router;
