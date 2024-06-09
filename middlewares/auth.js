// auth.js
import { User } from "../models/userSchema.js";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./Error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User not Authenticated!", 400));
  }

  try {
    // If token is an object, extract the string representation
    const tokenString =
      typeof token === "object" ? JSON.stringify(token) : token;

    // Verify the token
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET_KEY);

    // Find the user based on the decoded token
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorHandler("User not found with this token", 400));
    }

    // Proceed to the next middleware
    next();
  } catch (err) {
    return next(
      new ErrorHandler(
        "JSON Web Token Rurr gea shi decode nhi ho rha, Try again!",
        400
      )
    );
  }
});
