import mongoose from "mongoose";
import MongoStore from "connect-mongo";

export const connectToDB = async () => {
  const DBURL = process.env.DB_URL;
  if (!DBURL) {
    throw new Error("DB_URL is not defined in .env");
  }

  try {
    await mongoose.connect(DBURL);
    console.log("connection successful");
  } catch (err) {
    console.error(err);
  }

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Database connected");
  });

  const store = MongoStore.create({
    mongoUrl: DBURL,
    collectionName: "sessions",
    touchAfter: 24 * 60 * 60,
  });

  store.on("error", function (e) {
    console.log("Session Store Error", e);
  });

  return store;
};
