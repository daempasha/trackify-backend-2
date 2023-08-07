import express, { Request, Response } from "express";
import multer from "multer";
import xlsx from "xlsx";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { formatQuantity, formatRows, formatLength } from "./helpers";
import { PreformattedPallet, FormattedItem } from "./types";

const upload = multer();
const router = express.Router();

// Create a standard DynamoDB client
const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-2' }); // update region accordingly

// Create a document client from the standard client
const client = DynamoDBDocumentClient.from(dynamoDbClient);

router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  const file = req.file;
  const data = file ?.buffer;
  const workbook = xlsx.read(data, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonData: PreformattedPallet[] = xlsx.utils.sheet_to_json(worksheet);

  // generate a new UUID for pallet id
  const palletId = uuidv4();

  const pallet = {
    TableName: "trackifyapi-test-trackify-dynamodb-table",
    Item: {
      id: palletId,
      name: jsonData[0].LOT,
      _dateImported: new Date().toISOString()
    }
  };

  // Save Pallet
  await client.send(new PutCommand(pallet));

  const formattedData = formatRows(palletId, jsonData);
  const formatLimitLength = formatLength(formattedData);
  const formattedQuantityData = formatQuantity(formatLimitLength);

  // Save Items
  for (let item of formattedQuantityData) {
    const params = {
      TableName: "trackifyapp-test-trackify-dynamodb",
      Item: {
        pallet: item.pallet,
        Title: item.Title,
        Description: item.Description,
        EAN: item.EAN,
        Currency: item.Currency,
        Country: item.Country,
        _dateImported: new Date().toISOString()
      }
    };
    await client.send(new PutCommand(params));
  }

  res.status(201).json({ message: "Successfully imported pallet!" });
});


//
// router.get("/:id/details", async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const params = {
//     TableName: 'Pallets',
//     Key: { id: id },
//   };
//   const command = new GetCommand(params);
//   const { Item } = await client.send(command);
//
//   res.send({ message: "Successfully retrieved details", data: Item });
// });
//
// router.get("/", async (_req: Request, res: Response) => {
//   const command = new ScanCommand({ TableName: 'Pallets' });
//   const { Items } = await client.send(command);
//
//   if (!Items) {
//     return res.json({ data: [] });
//   }
//
//   const updatedPallets = await Promise.all(
//     Items.map(async (pallet) => {
//       const itemCountCommand = new QueryCommand({
//         TableName: 'Items',
//         KeyConditionExpression: 'pallet = :pallet',
//         ExpressionAttributeValues: {
//           ':pallet': pallet.id
//         }
//       });
//       const { Count: itemCount } = await client.send(itemCountCommand);
//
//       return {
//         ...pallet,
//         itemCount,
//       };
//     }),
//   );
//
//   res.json({ data: updatedPallets });
// });
//
// router.post("/", async (req: Request, res: Response) => {
//   const palletId = uuidv4();
//   const newPallet = {
//     TableName: 'Pallets',
//     Item: {
//       id: palletId,
//       name: req.body.name,
//       _dateCreated: new Date().toISOString()
//     }
//   };
//
//   await client.send(new PutCommand(newPallet));
//
//   res.status(201).json(newPallet.Item);
// });
//
// router.delete("/:id", async (req: Request, res: Response) => {
//   const id = req.params.id;
//
//   // Deleting a Pallet
//   const deletePallet = new DeleteCommand({
//     TableName: 'Pallets',
//     Key: {
//       id: id
//     }
//   });
//
//   await client.send(deletePallet);
//
//   // Note: There is no direct operation to delete many in DynamoDB, you have to delete items one by one
//   // Here, for simplicity, items associated with the pallet are not deleted.
//
//   res.status(201).json({ message: "Successfully deleted pallet!" });
// });

export default router;
