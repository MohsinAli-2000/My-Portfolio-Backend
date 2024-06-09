import express from "express";
import {
  addProject,
  deleteProject,
  updateProject,
  getAllProjects,
  getSingleProject,
} from "../controllers/project.Controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.post("/add-project", isAuthenticated, addProject);
router.put("/update-project/:id", isAuthenticated, updateProject);
router.delete("/delete-project/:id", isAuthenticated, deleteProject);
router.get("/get-all-projects", getAllProjects);
router.get("/get-project/:id", getSingleProject);
export default router;
