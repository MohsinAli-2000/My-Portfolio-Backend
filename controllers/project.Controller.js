import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/Error.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Project } from "../models/projectSchema.js";

// Controller to add project
export const addProject = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Project thumbnail is required!", 400));
  }

  const {
    title,
    description,
    githubRepoLink,
    projectLink,
    technologies,
    stack,
    deployed,
  } = req.body;

  // Check if any of the required fields are missing
  if (
    !title ||
    !description ||
    !githubRepoLink ||
    !projectLink ||
    !technologies ||
    !stack ||
    !deployed
  ) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  const projectThumbnailFilePath = Array.isArray(req.files.projectThumbnail)
    ? req.files.projectThumbnail[0].tempFilePath
    : req.files.projectThumbnail.tempFilePath;

  try {
    const projectThumbnailResponse = await uploadOnCloudinary(
      projectThumbnailFilePath
    );

    if (!projectThumbnailResponse) {
      return next(
        new ErrorHandler("Error while uploading file to Cloudinary", 500)
      );
    }

    const project = await Project.create({
      title,
      description,
      githubRepoLink,
      projectLink,
      technologies,
      stack,
      deployed,
      projectThumbnail: {
        public_id: projectThumbnailResponse.public_id,
        url: projectThumbnailResponse.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "Project has been added successfully!",
      project,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Controller to update project
export const updateProject = catchAsyncError(async (req, res, next) => {
  const newProjectData = {
    title: req.body.title,
    description: req.body.description,
    githubRepoLink: req.body.githubRepoLink,
    projectLink: req.body.projectLink,
    technologies: req.body.technologies,
    stack: req.body.stack,
    deployed: req.body.deployed,
  };

  //updating projectThumbnail
  if (req.files && req.files.projectThumbnail) {
    const projectThumbnail = req.files.projectThumbnail;
    const project = await Project.findById(req.params.id);
    const oldThumbnailPublicId = project.projectThumbnail?.public_id;

    await cloudinary.uploader.destroy(oldThumbnailPublicId);

    const projectThumbnailFilePath = Array.isArray(projectThumbnail)
      ? projectThumbnail[0].tempFilePath
      : projectThumbnail.tempFilePath;

    const projectThumbnailResponse = await uploadOnCloudinary(
      projectThumbnailFilePath
    );

    if (!projectThumbnailResponse) {
      return next(
        new ErrorHandler("Error while uploading file to Cloudinary", 500)
      );
    }

    newProjectData.projectThumbnail = {
      public_id: projectThumbnailResponse.public_id,
      url: projectThumbnailResponse.secure_url,
    };
  }
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    newProjectData,
    {
      new: true,
      runValidators: true,
      UseFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Project has been updated successfully!",
    project,
  });
});

//controller to delete project
export const deleteProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project not found!"));
  }
  const oldThumbnailPublicId = project.projectThumbnail?.public_id;

  await cloudinary.uploader.destroy(oldThumbnailPublicId);
  await project.deleteOne();
  res.status(200).json({
    success: true,
    message: "Project has been deleted successfully!",
  });
});

//controller to get all project
export const getAllProjects = catchAsyncError(async (req, res, next) => {
  const projects = await Project.find();
  if (!projects) {
    return next(new ErrorHandler("No Project found", 404));
  }
  res.status(200).json({
    success: true,
    projects,
  });
});

//controller to get single project
export const getSingleProject = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    return next(new ErrorHandler("Project not found!", 404));
  }
  res.status(200).json({
    success: true,
    project,
  });
});
