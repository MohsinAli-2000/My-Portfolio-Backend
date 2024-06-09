import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/Error.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import { v2 as cloudinary } from "cloudinary";
import { sendEmail } from "../utils/nodemailer.js";
import crypto from "crypto";
export const register = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar & Resume files are required!", 400));
  }

  const { avatar, resume } = req.files;

  // Ensure both avatar and resume files exist
  if (!avatar || !resume) {
    return next(new ErrorHandler("Avatar & Resume files are required!", 400));
  }

  // Extract file paths from the uploaded files
  const avatarFilePath = Array.isArray(avatar)
    ? avatar[0].tempFilePath
    : avatar?.tempFilePath;
  const resumeFilePath = Array.isArray(resume)
    ? resume[0].tempFilePath
    : resume?.tempFilePath;

  try {
    // Upload avatar and resume to Cloudinary
    const avatarResponse = await uploadOnCloudinary(avatarFilePath);
    const resumeResponse = await uploadOnCloudinary(resumeFilePath);

    if (!avatarResponse || !resumeResponse) {
      return next(
        new ErrorHandler("Error while uploading files to Cloudinary", 500)
      );
    }

    // Extract other fields data from body
    const {
      fullName,
      email,
      phone,
      aboutMe,
      password,
      portfolioURL,
      githubURL,
      facebookURL,
      instagramURL,
      twitterURL,
      linkedinURL,
    } = req.body;

    // Create the user with Cloudinary URLs and public IDs for avatar and resume
    const userFields = {
      fullName,
      email,
      phone,
      aboutMe,
      password,
      portfolioURL,
      githubURL,
      facebookURL,
      instagramURL,
      twitterURL,
      linkedinURL,
      avatar: {
        public_id: avatarResponse.public_id,
        url: avatarResponse.secure_url,
      },
      resume: {
        public_id: resumeResponse.public_id,
        url: resumeResponse.secure_url,
      },
    };

    // Create the user
    const user = await User.create(userFields);

    //generate jwt token
    generateToken(user, "User Registered Successfully", 201, res);
  } catch (error) {
    console.error("Error details:", error);
    return next(new ErrorHandler("Error while saving user", 500));
  }
});

//controller to login user
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email & Password are required!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or password!", 400));
  }
  const isPasswordMatch = await user.isPasswordCorrect(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Password entered!", 400));
  }
  generateToken(user, "User Logged In successfully", 200, res);
});

//controller to logout User
export const logoutUser = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "None",
      secure: true,
    })
    .json({
      sucess: true,
      message: "User Logged Out succesfully!",
    });
});

//controller to get user
export const getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//controller to update user profile

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const updatedProfileData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    portfolioURL: req.body.portfolioURL,
    githubURL: req.body.githubURL,
    facebookURL: req.body.facebookURL,
    instagramURL: req.body.instagramURL,
    twitterURL: req.body.twitterURL,
    linkedinURL: req.body.linkedinURL,
  };

  //updating avatar file
  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;
    const user = await User.findById(req.user.id);
    const profileImage = user.avatar.public_id;
    await cloudinary.uploader.destroy(profileImage);
    const avatarFilePath = Array.isArray(avatar)
      ? avatar[0].tempFilePath
      : avatar?.tempFilePath;
    const avatarResponse = await uploadOnCloudinary(avatarFilePath);
    updatedProfileData.avatar = {
      public_id: avatarResponse.public_id,
      url: avatarResponse.secure_url,
    };
  }

  //updating resume file
  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const user = await User.findById(req.user.id);
    const resumeFile = user.resume.public_id;
    await cloudinary.uploader.destroy(resumeFile);
    const resumeFilePath = Array.isArray(resume)
      ? resume[0].tempFilePath
      : resume?.tempFilePath;
    const resumeResponse = await uploadOnCloudinary(resumeFilePath);
    updatedProfileData.resume = {
      public_id: resumeResponse.public_id,
      url: resumeResponse.secure_url,
    };
  }

  //updating user profile
  const user = await User.findByIdAndUpdate(req.user.id, updatedProfileData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Profile updated Successfully!",
    user,
  });
});

//controller to update user password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if ((!currentPassword, !newPassword, !confirmPassword)) {
    return next(new ErrorHandler("All fields are required!", 400));
  }
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    return next(
      new ErrorHandler(
        "Current Password is incorrect, Enter true Passowrd",
        400
      )
    );
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New Password and Confirm Password does not match!")
    );
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password reset successfully!",
  });
});

//controller to get user portfolio
export const getUserPortfolio = catchAsyncError(async (req, res, next) => {
  const userID = process.env.USER_ID;
  const user = await User.findById(userID);
  res.status(200).json({
    success: true,
    user,
  });
});

//controller for forgot password
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User with this email does not exist!", 404));
  }
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordURL = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  const message = `Your reset password token is: \n\n ${resetPasswordURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request: ",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent tp ${user.email} successfullyy!`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
});

//controller for reset Password
export const resetPasssword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("Reset Password Token is invalid or expired!", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm Passwords are not same!")
    );
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  generateToken(user, "Password Reset Successfully!", 200, res);
});
