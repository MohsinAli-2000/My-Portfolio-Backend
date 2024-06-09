import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/Error.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Skill } from "../models/skillSchema.js";
//controller to add skill
export const addSkill = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Skill ICON/SVG is required!", 400));
  }

  const { svg } = req.files;
  const { title, proficiency } = req.body;

  if (!title || !proficiency) {
    return next(
      new ErrorHandler("Title & Proficiency in skill is required!", 400)
    );
  }

  const svgFilePath = Array.isArray(svg)
    ? svg[0].tempFilePath
    : svg?.tempFilePath;

  try {
    const svgResponse = await uploadOnCloudinary(svgFilePath);

    if (!svgResponse) {
      return next(
        new ErrorHandler("Error while uploading file to Cloudinary", 500)
      );
    }

    const mySkill = await Skill.create({
      title,
      proficiency,
      svg: {
        public_id: svgResponse.public_id,
        url: svgResponse.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "New Skill has been added!",
      mySkill,
    });
  } catch (error) {
    next(error);
  }
});

//controller to delete skill
export const deleteSkill = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const skill = await Skill.findById(id);

  if (!skill) {
    return next(new ErrorHandler("Skill not found", 404));
  }

  const skillSVGId = skill.svg.public_id;

  await cloudinary.uploader.destroy(skillSVGId);
  await skill.deleteOne();

  res.status(200).json({
    success: true,
    message: "Skill has been deleted successfully!",
  });
});

//controller to update skill
export const updateSkill = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let skill = await Skill.findById(id);
  if (!skill) {
    next(new ErrorHandler("Skill not found!"), 404);
  }
  const { proficiency } = req.body;
  skill = await Skill.findByIdAndUpdate(
    id,
    { proficiency },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Skill has been updated successfully!",
    skill,
  });
});

//controller to get all skill
export const getAllSkill = catchAsyncError(async (req, res, next) => {
  try {
    const skills = await Skill.find();
    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    next(error);
  }
});
