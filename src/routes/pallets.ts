import express, { Request, Response } from "express";
import { Pallet } from "../models/pallets";
import { Item } from "../models/items";
import { PreformattedPallet } from "../types/preformatPallets";
import multer from "multer";
import xlsx from "xlsx";

const upload = multer();

const router = express.Router();

router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  const file = req.file;
  const data = file?.buffer;
  const workbook = xlsx.read(data, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonData: PreformattedPallet[] = xlsx.utils.sheet_to_json(worksheet);

  console.log(jsonData[0].LOT);

  // Create models
  const pallet = new Pallet({
    name: jsonData[0].LOT,
  });
  const newPallet = await pallet.save();
  const newItems = await Item.insertMany(
    jsonData.map((itemData) => ({ ...itemData, pallet: newPallet._id })),
  );
  res.status(201).json(newPallet);
  // res.send(jsonData);
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const pallets = await Pallet.find();
    res.json({ data: pallets });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const pallet = new Pallet({
    name: req.body.name,
  });

  try {
    const newPallet = await pallet.save();
    res.status(201).json(newPallet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
