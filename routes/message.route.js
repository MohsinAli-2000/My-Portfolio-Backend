import express from "express";
import {
  getAllMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/message.Controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.post("/send", sendMessage);
router.get("/get-all", getAllMessages);
router.delete("/delete/:id", isAuthenticated, deleteMessage);
export default router;
