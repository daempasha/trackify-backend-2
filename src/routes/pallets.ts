import express, { Request, Response } from "express";
import { Pallet } from "../models/pallets";
import { Item } from "../models/items";
import { PreformattedPallet } from "../types/preformatPallets";
import multer from "multer";
import xlsx from "xlsx";
import mongoose from "mongoose";

// const columnNames = [
//   "asin",
//   "category",
//   "condition",
//   "description",
//   "ean",
//   "ebay_item_id",
//   "id",
//   "image_url",
//   "item_condition",
//   "name",
//   "pallet_id",
//   "postage",
//   "price",
//   "quantity",
//   "status",
// ];
const upload = multer();

const router = express.Router();

interface FormattedItem {
  Title: string;
  Description: string;
  EAN: string;
  Quantity?: number;
  Currency: string;
  Country: string;
}

function formatRows(palletId: mongoose.Types.ObjectId, jsonData: PreformattedPallet[]) {
  return jsonData.map((itemData) => ({
    Title: itemData.Item,
    Description: itemData.Item,
    EAN: itemData.EAN,
    Quantity: itemData.Quantity,
    Currency: "GBP",
    Country: "GB",
    pallet: palletId,
  }));
}

function formatQuantity(data: FormattedItem[]) {
  let formattedData = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    for (let j = 0; j < row.Quantity!; j++) {
      const { Quantity, ...restOfRow } = row;
      formattedData.push({ ...restOfRow, Title: j > 0 ? `${row.Title} - ${j}` : row.Title });
    }
  }

  return formattedData;
}

function formatLength(data: FormattedItem[]) {
  return data.map((item) => {
    return {
      ...item,
      Title: item.Title.length >= 76 ? item.Title.substring(0, 76) : item.Title,
    };
  });
}

router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  const file = req.file;
  const data = file?.buffer;
  const workbook = xlsx.read(data, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonData: PreformattedPallet[] = xlsx.utils.sheet_to_json(worksheet);

  const pallet = new Pallet({
    name: jsonData[0].LOT,
  });
  await pallet.save();

  const formattedData = formatRows(pallet._id, jsonData);
  const formatLimitLength = formatLength(formattedData);
  const formattedQuantityData = formatQuantity(formatLimitLength);

  await Item.insertMany(formattedQuantityData);
  res.status(201).json({ message: "Succesfully imported pallet!" });
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

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const pageNumber = parseInt(req.query.pageNumber as string);
  const rowsPerPage = parseInt(req.query.rowsPerPage as string);
  const sortDirection = req.query.sortDirection;
  const sortField = req.query.sortField;
  const search = req.query.search;
  const statusFilter = req.query.statusFilter;

  const searchFilters = [
    {
      pallet: id,
      ...(search ? { Title: { $regex: search, $options: "i" } } : {}),
      ...(statusFilter !== "all" ? { Status: statusFilter } : {}),
    },
  ];

  let sortOptions: { [key: string]: any } = {};
  if (sortField && sortDirection) {
    sortOptions[sortField as string] = sortDirection === "desc" ? -1 : 1;
  }

  const rowsToSkip = Math.max((pageNumber - 1) * rowsPerPage, 0);

  const pallet = await Pallet.findOne({ _id: id });

  const itemCount = await Item.countDocuments({ $and: searchFilters });
  const items = await Item.find({ $and: searchFilters })
    .collation({ locale: "en", strength: 2 })
    .sort(sortOptions)
    .skip(rowsToSkip)
    .limit(rowsPerPage);

  res.json({
    message: "Retrieved items!",
    data: items,
    pallet,
    noOfRows: rowsPerPage,
    currentPage: pageNumber,
    totalRows: itemCount,
  });
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

router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await Pallet.deleteOne({ _id: id });
    await Item.deleteMany({ pallet: id });
    res.status(201).json({ message: "Successfully deleted pallet!" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});
export default router;
