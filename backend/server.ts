import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes.ts";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
