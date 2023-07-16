import mongoose from "mongoose";

const palletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  _dateImported: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Pallet = mongoose.model("Pallet", palletSchema);

export { Pallet };
