import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { MongoClient } from 'mongodb';
import palletRouter from "./routes/pallets";
import itemsRouter from "./routes/items";
import ebayRouter from "./routes/ebay";
import cors from "cors";
import morgan from "morgan";
import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const mongodb_uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/trackify";

console.log(`Connecting to MongoDB at ${mongodb_uri}`);  // Logs the MongoDB URI

const client = new MongoClient(mongodb_uri, {
    tlsCAFile: path.resolve(__dirname, '../global-bundle.pem'),
    retryWrites: false
});

const main = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');  // Logs the attempt to connect
        await client.connect();
        console.log("Connected!");
        const db = client.db('trackify');

        app.use(morgan("tiny"));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cors());

        app.use("/api/pallets", palletRouter);
        app.use("/api/items", itemsRouter);
        app.use("/api/ebay", ebayRouter);

        app.get("/test", (req: Request, res: Response) => {
            res.send({ message: "Hello world" });
        });

        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://127.0.0.1:${port}`);
        });
    } catch (e) {
        console.error('Error:', e);
    }
}

main().catch(err => console.error('Unhandled Promise Rejection:', err));  // More explicit error message
