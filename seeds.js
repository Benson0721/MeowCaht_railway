import Chatroom from "./models/chatroom-schema.js";
import ChatroomMember from "./models/chatroom_member-schema.js";
import Sticker from "./models/sticker-schema.js";
import User from "./models/user-schema.js";
import path from "path";
import { connectToDB } from "./utils/mongoDB.js";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Message from "./models/message-schema.js";

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

connectToDB();

async function seedChatroomMember() {
  try {
    const chatroomMembers = await ChatroomMember.deleteMany({
      chatroom_id: {
        $ne: new mongoose.Types.ObjectId("6841736bc6e1ff00b29a1822"),
      },
    });
    console.log(chatroomMembers);
    console.log("ChatroomMember seeded successfully!");
  } catch (error) {
    console.error("Error seeding ChatroomMember:", error);
  }
}

await seedChatroomMember();
