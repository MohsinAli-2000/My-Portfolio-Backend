import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  senderName: {
    type: String,
    minLength: [3, "Name must contain at least 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  subject: {
    type: String,
    minLength: [3, "Subject must contain at least 3 characters"],
  },
  message: {
    type: String,
    minLength: [3, "Message must contain at least 3 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Message = mongoose.model("Message", messageSchema);
