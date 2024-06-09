import { Message } from "../models/messageSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/Error.js";

// Controller to send a message
export const sendMessage = catchAsyncError(async (req, res, next) => {
  const { senderName, email, subject, message } = req.body;

  if (!senderName || !email || !subject || !message) {
    return next(new ErrorHandler("Please fill the full form!", 400));
  }

  // Email validation regex
  const emailRegex = /.+\@.+\..+/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Please enter a valid email address!", 400));
  }

  const data = await Message.create({ senderName, email, subject, message });

  res.status(201).json({
    success: true,
    message: "Message Sent",
    data,
  });
});

// Controller to delete a message
export const deleteMessage = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const message = await Message.findById(id);

  if (!message) {
    return next(new ErrorHandler("Message does not exist!", 400));
  }

  await message.deleteOne();

  res.status(201).json({
    success: true,
    message: "Message deleted successfully",
  });
});

// Controller to get all messages
export const getAllMessages = catchAsyncError(async (req, res, next) => {
  const messages = await Message.find();

  res.status(201).json({
    success: true,
    messages,
  });
});
