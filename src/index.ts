import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import router from "./routes";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app: Application = express();

app.use(morgan("tiny"));
app.use(router);
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log("Server is running on URL", `http://localhost:${PORT}`);
});
