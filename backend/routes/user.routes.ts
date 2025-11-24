import { Router } from "express";
import {
  register,
  login,
  resetPassword,
  checkUserExists,
} from "../controllers/user.controller.ts";
import { sql } from "../utils/db.ts";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/check-user-exists", checkUserExists);
router.get("/", async (req, res) => {
  try {
    const users = await sql`
      SELECT id, name, email, address
      FROM users
    `;

    res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
