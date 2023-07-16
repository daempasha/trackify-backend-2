import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    pallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pallet",
    },
    name: {
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
