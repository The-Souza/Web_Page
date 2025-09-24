import { Router } from "express";
import {
  register,
  login,
  resetPassword,
  checkUserExists,
} from "../controllers/user.controller.ts";
import { getConnection } from "../utils/db.ts";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/check-user-exists", checkUserExists);

router.get("/", async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.query(
      "SELECT Id, Name, Email, Address FROM Users"
    );
    res.json({ success: true, users: result.recordset });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
