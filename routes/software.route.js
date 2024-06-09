import express from "express";
import {
  addSoftware,
  deleteSoftware,
  getAllSoftware,
} from "../controllers/software.Controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.post("/add-software", isAuthenticated, addSoftware);
router.delete("/delete-software/:id", isAuthenticated, deleteSoftware);
router.get("/get-all-softwares",  getAllSoftware);
export default router;
