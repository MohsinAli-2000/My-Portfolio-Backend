import express from "express";
import {
  addSkill,
  deleteSkill,
  updateSkill,
  getAllSkill,
} from "../controllers/skill.Controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.post("/add-skill", isAuthenticated, addSkill);
router.delete("/delete-skill/:id", isAuthenticated, deleteSkill);
router.put("/update-skill/:id", isAuthenticated, updateSkill);
router.get("/get-all-skills", getAllSkill);
export default router;
