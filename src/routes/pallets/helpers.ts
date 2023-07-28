import mongoose from "mongoose";
import { FormattedItem, PreformattedPallet } from "./types";

export function formatRows(palletId: mongoose.Types.ObjectId, jsonData: PreformattedPallet[]) {
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

export function formatQuantity(data: FormattedItem[]) {
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
