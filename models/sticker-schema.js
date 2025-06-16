import mongoose from "mongoose";

const StickerSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  images: { type: Array, default: [] },
});

const Sticker = mongoose.model("Sticker", StickerSchema);

export default Sticker;
