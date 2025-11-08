import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.ts";
import accountRoutes from "./routes/account.routes.ts";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❌ Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
    next(err);
  }
);

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
