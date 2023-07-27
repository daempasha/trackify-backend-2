import express, { Request, Response } from "express";
import { Item } from "../../models/items";
import multer from "multer";

const router = express.Router();
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
