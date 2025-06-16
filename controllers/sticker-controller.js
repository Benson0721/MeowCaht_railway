import Sticker from "../models/sticker-schema.js";
export const getSticker = async (req, res) => {
  const stickers = await Sticker.find({});
  res.json(stickers);
};
