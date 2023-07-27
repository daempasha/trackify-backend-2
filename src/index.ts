import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import palletRouter from "./routes/pallets";
import itemsRouter from "./routes/items";
import ebayRouter from "./routes/ebay";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const mongodb_uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/trackify";

app.use(morgan("tiny"));
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(cors());

mongoose.connect(mongodb_uri).then(() => console.log("Connected!"));

app.use("/api/pallets", palletRouter);
app.use("/api/items", itemsRouter);
app.use("/api/ebay", ebayRouter);

app.listen(port, () => {
  console.log(` ⚡️[server]: Server is running at http://localhost:${port}`);
});
