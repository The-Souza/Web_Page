import { Router } from "express";
import { register, login, resetPassword, checkUserExists } from "../controllers/user.controller.ts";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/check-user-exists", checkUserExists);

router.get("/", async (req, res) => {
  res.json({ message: "Users route is working" });
});

export default router;
