import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import type { User } from "./User.types";
import { logBackend } from "./Logger.ts"; // ✅ usa logger padronizado

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const usersFile = path.join(__dirname, "users.json");

const getUsers = (): User[] => {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
};

const saveUsers = (users: User[]) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

app.post("/register", (req, res) => {
  const user = req.body;
  const users = getUsers();
  if (users.some((u) => u.email === user.email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push(user);
  saveUsers(users);
  logBackend("CREATE ACCOUNT", { user });
  return res.json({ success: true });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  logBackend("LOGIN", { user: { name: user.name, email: user.email } });
  return res.json({ success: true });
});

app.post("/reset-password", (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const index = users.findIndex((u) => u.email === email);
  if (index === -1) return res.status(400).json({ message: "User not found" });
  users[index].password = password;
  saveUsers(users);
  logBackend("USER CHANGED PASSWORD", { user: users[index] });
  return res.json({ success: true });
});

app.post("/check-user-exists", (req, res) => {
  const { email } = req.body;
  const users = getUsers();
  const exists = users.some((u) => u.email === email);
  return res.json({ exists });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
