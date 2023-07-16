import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    // Title: itemData.Item,
    // Description: itemData.Item,
    // Currency: "GBP",
    // Country: "GB",
    // pallet: newPallet._id,
    pallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pallet",
    },
    Title: {
      type: String,
    },
    Description: {
      type: String,
    },
    _dateImported: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { strict: false },
);

const Item = mongoose.model("Item", itemSchema);

export { Item };
