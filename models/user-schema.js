import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    avatar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=faces",
    },
    status: { type: String, enum: ["online", "away", "offline"], default: "offline" },
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const User = mongoose.model("User", UserSchema);

export default User;
