import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import palletRouter from "./routes/pallets";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const mongodb_uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/trackify";

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(mongodb_uri).then(() => console.log("Connected!"));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/pallets", palletRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
