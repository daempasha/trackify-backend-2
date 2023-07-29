import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoClient } from 'mongodb';
import palletRouter from "./routes/pallets";
import itemsRouter from "./routes/items";
import ebayRouter from "./routes/ebay";
import cors from "cors";
import morgan from "morgan";
import fs from 'fs';
import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const base = process.env.PWD;

const mongodb_uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/trackify";
const ca = fs.readFileSync(base + '../global-bundle.pem'), 'utf8');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslValidate: true,
    sslCA: ca,
    sslKey: ca,
    sslCert: ca,
    retryWrites: false
};

const client = new MongoClient(mongodb_uri, options);

client.connect()
    .then(() => {
        console.log("Connected!");
        mongoose.connection.useDb('trackify');
    })
    .catch(err => console.error(err));

app.use(morgan("tiny"));
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(cors());

app.use("/api/pallets", palletRouter);
app.use("/api/items", itemsRouter);
app.use("/api/ebay", ebayRouter);

app.get("/test", (req: Request, res: Response) => {
  res.send({ message: "Hello world" });
});

app.listen(port, () => {
  console.log(` ⚡️[server]: Server is running at http://localhost:${port}`);
});
