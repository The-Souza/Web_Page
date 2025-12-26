import "./utils/env.js";
import app from "./app.js";

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
  console.log(`\n✅ Backend running at http://localhost:${PORT}`);
});
