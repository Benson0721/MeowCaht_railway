import express from "express";
import {
  logout,
  signup,
  editUser,
  getOtherUsers,
  changeStatus,
  login,
} from "../controllers/user-controller.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = express.Router();

router.get("/checkAuth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router
  .get("/", checkAuth, getOtherUsers)
  .put("/", checkAuth, editUser)
  .patch("/", changeStatus);

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

export { router };
