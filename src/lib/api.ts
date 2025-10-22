import axios from "axios";

const PORT = 5000;

export const api = axios.create({
  baseURL: `http://localhost:${PORT}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
