import express from "express";
import {
  addTimeline,
  deleteTimeLine,
  getTimeLine,
} from "../controllers/timeline.Controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.post("/add-timeline",isAuthenticated, addTimeline);
router.delete("/delete-timeline/:id",isAuthenticated, deleteTimeLine);
router.get("/get-all-timelines", getTimeLine);
export default router;
