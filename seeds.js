import { connectToDB } from "./mongoDB.js";
import mongoose from "mongoose";
import path from "path";
import { PortfolioFrontImage } from "./models/PortfolioFrontImageSchema.js";
import { GalleryImage } from "./models/GalleryImageSchema.js";
import { AlbumImage } from "./models/AlbumImageSchema.js";
import { DisplayImage } from "./models/DisplayImageSchema.js";
import { AboutMe } from "./models/AboutMeSchema.js";
import { SectionImage } from "./models/SectionImageSchema.js";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

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

const newImages = [
  {
    category: "All",
    imageURL:
      "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1745321482/Pai/views/portfolio/Architecture/spopig4s6izleqdfahck.jpg",
  },
  {
    category: "Architecture",
    imageURL:
      "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1745757660/Pai/views/portfolio/Architecture/rp4ahp00e7z7jz7pfd6q.jpg",
  },
  {
    category: "Landscape",
    imageURL:
      "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1745406064/Pai/views/portfolio/Landscape/sag3srh2ongcvrqoicyg.jpg",
  },
  {
    category: "Motorcycle",
    imageURL:
      "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1745758165/Pai/views/portfolio/Motorcycle/megeehvrzrayz5pcq3hh.jpg",
  },
  {
    category: "Others",
    imageURL:
      "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1745757790/Pai/views/portfolio/Others/bprffwjupqyrkyoanwsr.jpg",
  },
  {
    category: "Portrait",
    imageURL:
      "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1745758012/Pai/views/portfolio/Portrait/fptmn4gok0bq7tqztvx1.jpg",
  },
  {
    category: "Street",
    imageURL:
      "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1745751330/Pai/views/portfolio/Street/vkf1e9qrtytie2rf5ec4.jpg",
  },
];

async function seedImages() {
  try {
    await SectionImage.updateMany(
      {},
      { offsetY: { mobile: 0, tablet: 0, desktop: 0 } }
    );
    console.log("SectionImage seeded successfully!");
  } catch (error) {
    console.error("Error seeding SectionImage:", error);
  }
}

await seedImages();
