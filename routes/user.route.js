import express from "express";
import {
  forgotPassword,
  getUser,
  getUserPortfolio,
  loginUser,
  logoutUser,
  register,
  resetPasssword,
  updatePassword,
  updateProfile,
} from "../controllers/user.Controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

//route to register
router.post("/register", register);
//route to login
router.post("/login", loginUser);
router.get("/logout", isAuthenticated, logoutUser);
router.get("/my-profile", isAuthenticated, getUser);
router.put("/update/my-profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);
router.get("/my-profile/user-portfolio", getUserPortfolio);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPasssword);
export default router;
