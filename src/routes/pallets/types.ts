export interface PreformattedPallet {
  LOT: string;
  ASIN: string;
  Condition: string;
  Item: string;
  Quantity: number;
  "Unit Price": string;
  "Est. selling price on Az": string;
  EAN: string;
}

export interface FormattedItem {
  Title: string;
  Description: string;
  EAN: string;
  Quantity?: number;
  Currency: string;
  Country: string;
}
