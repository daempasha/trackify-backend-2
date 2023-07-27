import express, { Request, Response } from "express";
import { Item } from "../../models/items";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";

const router = express.Router();
const s3 = new S3Client({});
const upload = multer();

router.patch("/:id", upload.single("file"), async (req: Request, res: Response) => {
  console.log(req.file);
  console.log(req.body);
  console.log(req.params);
  console.log(req.query);
  res.status(404).json({ message: "Hello world" });
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  const item = await Item.findById(id);
  res.json({ message: "Successfully retrieved item!", data: item });
});
export default router;
