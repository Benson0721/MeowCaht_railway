import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    avatar: { type: String },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const User = mongoose.model("User", UserSchema);

export default User;
