import Chatroom from "./models/chatroom-schema.js";
import path from "path";
import { connectToDB } from "./utils/mongoDB.js";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  // 動態解析 .env 的絕對路徑
  const envPath = path.resolve(__dirname, ".env");
  console.log("Loading .env from:", envPath);

  // 檢查 .env 檔案是否存在
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env file not found at:${envPath}`);
  }

  // 加載環境變數
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    throw new Error(`Failed to load .env: ${result.error.message}`);
  }
}

const store = await connectToDB();
const seedChatrooms = [
  {
    type: "private",
    name: "",
    members: [
      new mongoose.Types.ObjectId("6842526c666b6a408c6483ef"),
      new mongoose.Types.ObjectId("6842529e666b6a408c6483f9"),
    ],
    avatar: "",
  },
  {
    type: "private",
    name: "",
    members: [
      new mongoose.Types.ObjectId("6842526c666b6a408c6483ef"),
      new mongoose.Types.ObjectId("684252df666b6a408c648403"),
    ],
    avatar: "",
  },
];

async function seedChatroom() {
  try {
    await Chatroom.insertMany(seedChatrooms);
    console.log("Chatroom seeded successfully!");
  } catch (error) {
    console.error("Error seeding Chatroom:", error);
  }
}

await seedChatroom();
