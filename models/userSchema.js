// userSchema.js
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone no is required"],
  },
  aboutMe: {
    type: String,
    required: [true, "About me field is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must contain min 8 characters"],
    select: false,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  resume: {
    public_id: String,
    url: String,
  },
  portfolioURL: {
    type: String,
    required: [true, "Portfolio URL is required"],
  },
  githubURL: String,
  facebookURL: String,
  instagramURL: String,
  twitterURL: String,
  linkedinURL: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Hashing the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Comparing the password to login the user
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generating JSON web token
userSchema.methods.generateWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

//Generating reset password token
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(10).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
