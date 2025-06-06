import mongoose from "mongoose";

const ChatroomSchema = new mongoose.Schema({
  type: { type: String, enum: ["private", "group", "global"], required: true },
  avatar: { type: String, default: "" },
  name: { type: String, default: "" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Chatroom = mongoose.model("Chatroom", ChatroomSchema);

export default Chatroom;
