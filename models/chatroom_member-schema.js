import mongoose from "mongoose";

const ChatroomMemberSchema = new mongoose.Schema({
  chatroom_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chatroom",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  joined_at: { type: Date, default: Date.now },
  last_read_at: { type: Date, default: Date.now },
  unread_count: { type: Number, default: 0 },
});

const ChatroomMember = mongoose.model("ChatroomMember", ChatroomMemberSchema);

export default ChatroomMember;
