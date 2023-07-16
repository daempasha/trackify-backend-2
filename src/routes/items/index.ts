import express, { Request, Response } from "express";
import { Item } from "../../models/items";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  const item = await Item.findById(id);
  res.json({ message: "Successfully retrieved item!", data: item });
});
export default router;
