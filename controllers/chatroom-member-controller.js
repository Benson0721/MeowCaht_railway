import ChatroomMember from "../models/chatroom_member-schema.js";
import Message from "../models/message-schema.js";

export const getChatroomMember = async (req, res) => {
  try {
    const { user_id } = req.query;

    // 1. 取得我參與的聊天室成員紀錄
    const chatrooms = await ChatroomMember.find({ user_id });

    const chatroomIDs = chatrooms.map((c) => c.chatroom_id);

    // 2. 查所有成員（包含我以外的） in 同樣聊天室
    const allChatroomMembers = await ChatroomMember.find({
      chatroom_id: { $in: chatroomIDs },
    }).populate("chatroom_id");

    // 3. 整理回傳資料
    const result = {};
    for (const member of allChatroomMembers) {
      const chatroomId = member.chatroom_id?._id?.toString();

      if (!result[chatroomId]) {
        result[chatroomId] = { members: [] };
      }
      result[chatroomId].members.push(member);
    }

    res.json(result);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateLastReadAt = async (req, res) => {
  try {
    const { user_id, chatroom_id, last_read_at } = req.body;
    const chatroomMember = await ChatroomMember.findOne({
      chatroom_id: chatroom_id,
      user_id: user_id,
    });
    if (!chatroomMember) {
      return res.status(404).json({ error: "Chatroom member not found" });
    }
    chatroomMember.last_read_at = last_read_at;
    await chatroomMember.save();
    res.json(chatroomMember);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateUnreadCount = async (req, res) => {
  try {
    const { user_id, chatroom_id } = req.body;
    const chatroomMember = await ChatroomMember.findOne({
      chatroom_id: chatroom_id,
      user_id: user_id,
    }).populate("user_id");
    if (!chatroomMember) {
      return res.status(404).json({ error: "Chatroom member not found" });
    }
    const unreadCount = await Message.countDocuments({
      chatroom_id: chatroom_id,
      isRecalled: false,
      user: { $ne: user_id },
      createdAt: { $gt: chatroomMember.last_read_at },
    });

    chatroomMember.unread_count = unreadCount;

    await chatroomMember.save();
    res.json(chatroomMember);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const addChatroomMember = async (req, res) => {
  try {
    const { user_id, chatroom_id } = req.body;
    const chatroomMember = new ChatroomMember({
      user_id: user_id,
      chatroom_id: chatroom_id,
    });
    const savedChatroomMember = await chatroomMember.save();
    res.json(savedChatroomMember);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};
