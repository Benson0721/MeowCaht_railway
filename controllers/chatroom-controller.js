import Chatroom from "../models/chatroom-schema.js";
import ChatroomMember from "../models/chatroom_member-schema.js";
import Message from "../models/message-schema.js";

export const getChatrooms = async (req, res) => {
  try {
    const { user_id } = req.query;
    const chatrooms = await Chatroom.find({ members: { $in: user_id } });
    res.json(chatrooms);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const newChatroom = async (req, res) => {
  try {
    const { type, members, avatar, name } = req.body;
    const chatroom = new Chatroom({
      type: type,
      avatar: avatar,
      name: name,
      members: members,
    });
    const savedChatroom = await chatroom.save();

    members.forEach((member) => {
      const chatroomMember = new ChatroomMember({
        user_id: member,
        chatroom_id: savedChatroom._id,
      });
      chatroomMember.save();
    });

    res.json(savedChatroom);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

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
    //console.log("allChatroomMembers", allChatroomMembers);
    for (const member of allChatroomMembers) {
      const chatroomId = member.chatroom_id._id.toString();

      if (!result[chatroomId]) {
        result[chatroomId] = { members: [] };
      }
      result[chatroomId].members.push(member);
    }

    //console.log("結果 result", result);
    res.json(result);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateLastReadAt = async (req, res) => {
  try {
    const { user_id, chatroom_id, last_read_at } = req.body;
    console.log("更新 last_read_at", last_read_at);
    console.log(user_id, chatroom_id, last_read_at);
    const chatroomMember = await ChatroomMember.findOne({
      chatroom_id: chatroom_id,
      user_id: user_id,
    });
    if (!chatroomMember) {
      return res.status(404).json({ error: "Chatroom member not found" });
    }
    chatroomMember.last_read_at = last_read_at;
    console.log(chatroomMember);
    await chatroomMember.save();
    res.json(chatroomMember);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const updateUnreadCount = async (req, res) => {
  try {
    console.log("觸發 updateUnreadCount");
    const { user_id, chatroom_id } = req.body;
    console.log(user_id, chatroom_id);
    const chatroomMember = await ChatroomMember.findOne({
      chatroom_id: chatroom_id,
      user_id: user_id,
    }).populate("user_id");
    if (!chatroomMember) {
      return res.status(404).json({ error: "Chatroom member not found" });
    }
    console.log(
      chatroomMember.user_id.username,
      chatroomMember.last_read_at,
      chatroomMember.unread_count
    );
    const unreadCount = await Message.countDocuments({
      chatroom_id: chatroom_id,
      isRecalled: false,
      user: { $ne: user_id },
      createdAt: { $gt: chatroomMember.last_read_at },
    });
    const msgs = await Message.find({
      chatroom_id: chatroom_id,
      isRecalled: false,
      user: { $ne: user_id },
      createdAt: { $gt: chatroomMember.last_read_at },
    });
    console.log(msgs);
    console.log("user_id", user_id);
    console.log("unreadCount: ", unreadCount);
    chatroomMember.unread_count = unreadCount;

    await chatroomMember.save();
    res.json(chatroomMember);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};
