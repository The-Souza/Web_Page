import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import type { User } from "../models/user.types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const usersFile = path.join(__dirname, "../data/users.json");

const getUsers = (): User[] => {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, "utf-8"));
};

const saveUsers = (users: User[]) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

export const exists = (email: string): boolean => {
  return getUsers().some((u) => u.email === email);
};

export const add = (user: User) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const authenticate = (email: string, password: string): User | null => {
  return getUsers().find((u) => u.email === email && u.password === password) ?? null;
};

export const updatePassword = (email: string, password: string): User | null => {
  const users = getUsers();
  const index = users.findIndex((u) => u.email === email);
  if (index === -1) return null;
  users[index].password = password;
  saveUsers(users);
  return users[index];
};

export const getUserEmail = (email: string): User | null => {
  return getUsers().find(u => u.email === email) ?? null;
};

