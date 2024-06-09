import express from "express";
import {
  addCertificate,
  deleteCertificate,
  getAllCertificate,
  getSingleCertificate,
} from "../controllers/certificate.Controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.post("/add-certificate", isAuthenticated, addCertificate);
router.delete("/delete-certificate/:id", isAuthenticated, deleteCertificate);
router.get("/get-all-certificate", getAllCertificate);
router.get("/get-certificate/:id", getSingleCertificate);
export default router;
