import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";  // Ensure ListTablesCommand is imported
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import palletRouter from "./routes/pallets";
import itemsRouter from "./routes/items";
import ebayRouter from "./routes/ebay";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
const region = process.env.AWS_REGION || 'eu-west-2'; // specify your AWS region

// AWS DynamoDB configuration
const dynamoDbClient = new DynamoDBClient({
  region: region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "default",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "default"
  }
});

const dynamodbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

const main = async () => {
    try {
        console.log('Attempting to connect to DynamoDB...');

        // Correctly use ListTablesCommand with dynamoDbClient.send()
        const tables = await dynamoDbClient.send(new ListTablesCommand({}));
        console.log("Connected to DynamoDB!");
        console.log("Tables: ", tables.TableNames);

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

        app.get("/healthcheck", (req: Request, res: Response) => {
            res.send({ message: "Health check OK" });
        });

        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        });

    } catch (e) {
        console.error('Error:', e);
    }
}

main().catch(err => console.error('Unhandled Promise Rejection:', err));  // More explicit error message
