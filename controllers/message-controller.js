import Message from "../models/message-schema.js";
import ChatroomMember from "../models/chatroom_member-schema.js";

export const getHistoryMessage = async (req, res) => {
  try {
    const { chatroom_id } = req.query;
    const messages = await Message.find({ chatroom_id })
      .populate("user")
      .populate({ path: "reply_to", populate: "user" });
    res.json(messages);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatroom_id, user_id, content, type, reply_to } = req.body;
    console.log(chatroom_id, user_id, content, type, reply_to);
    const message = new Message({
      chatroom_id,
      user: user_id,
      content,
      type,
    });
    if (reply_to) {
      message.reply_to = reply_to;
    }
    const savedMessage = await message.save();
    const foundNewMessage = await Message.findById(savedMessage._id)
      .populate("user")
      .populate({ path: "reply_to", populate: "user" });
    res.json(foundNewMessage);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const recallMessage = async (req, res) => {
  try {
    const { message_id } = req.body;
    console.log("撤回訊息", message_id);
    const message = await Message.findByIdAndUpdate(
      message_id,
      { $set: { isRecalled: true } },
      { new: true }
    ).populate("user");

    res.json(message);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

/*export const lastReadMessage = async (req, res) => {
    try {
        const { chatroom_id, user_id, readtime } = req.body;
        const chatroomMember = await ChatroomMember.findOne({ chatroom_id, user_id });
        chatroomMember.last_read_at = readtime;
        await chatroomMember.save();
        res.json(chatroomMember);
    } catch (error) {
        console.error("伺服器錯誤:", error.message);
        res.status(400).json({ error: error.message });
    }
};*/

export const getReadCount = async (message_id) => {
  try {
    const message = await Message.findById(message_id);
    const members = await ChatroomMember.find({
      chatroom_id: message.chatroom_id,
    });
    const readCount = members.filter(
      (member) => member.last_read_at > message.createdAt
    ).length;
    return readCount;
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    return 0;
  }
};
