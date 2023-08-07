import { FormattedItem, PreformattedPallet } from "./types";

export function formatRows(palletId: string, jsonData: PreformattedPallet[]): FormattedItem[] {
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
    const quantity = row.Quantity ?? 0; // Ensure that quantity is a number, falling back to 0 if undefined
    for (let j = 0; j < quantity; j++) {
      const { Quantity, ...restOfRow } = row;
      const title = j > 0 ? `${row.Title} - ${j}` : row.Title;
      formattedData.push({ ...restOfRow, Title: title });
    }
  }

  return formattedData;
}

export function formatLength(data: FormattedItem[]) {
  return data.map((item) => {
    return {
      ...item,
      Title: item.Title.length >= 76 ? item.Title.substring(0, 76) : item.Title,
    };
  });
}