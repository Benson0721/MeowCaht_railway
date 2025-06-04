import User from "../models/user-schema.js";
import Chatroom from "../models/chatroom-schema.js";
import ChatroomMember from "../models/chatroom_member-schema.js";
import passport from "passport";

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("email already registered");
    }
    const newuser = new User({ email, username });
    const registeredUser = await User.register(newuser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.json(req.user);
    });
    const globalChatroom = await Chatroom.findOne({ type: "global" });
    if (!globalChatroom) {
      throw new Error("Global chatroom not found");
    }
    const chatroomMember = new ChatroomMember({
      user_id: registeredUser._id,
      chatroom_id: globalChatroom._id,
    });
    await chatroomMember.save();
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const login = (req, res) => {
  passport.authenticate("local", (err, user) => {
    if (err) return res.status(500).json({ error: "Login failed" });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentails" });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }
      return res.json(user);
    });
  })(req, res);
};

export const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });
};

export const editUser = async (req, res) => {
  try {
    const { username, avatar, _id } = req.body;
    const user = await User.findByIdAndUpdate(
      _id,
      { $set: { username, avatar } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    const { user_id } = req.query;
    const users = await User.find({ _id: { $ne: user_id } });
    const returnUsers = users.map((user) => {
      return {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        status: user.status,
      };
    });
    res.json(returnUsers);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { _id, status } = req.body;
    const user = await User.findByIdAndUpdate(
      _id,
      { $set: { status } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};
