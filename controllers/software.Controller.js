import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/Error.js";
import { Software } from "../models/softwareSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Controller to add software application
export const addSoftware = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Software ICON/SVG is required!", 400));
  }

  const { svg } = req.files;
  const { name } = req.body;

  if (!name) {
    return next(new ErrorHandler("Software name is required!", 400));
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

    const softwareApplication = await Software.create({
      name,
      svg: {
        public_id: svgResponse.public_id,
        url: svgResponse.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "New Software Application added!",
      softwareApplication,
    });
  } catch (error) {
    next(error);
  }
});

// Controller to delete software application
export const deleteSoftware = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const softwareApplication = await Software.findById(id);

  if (!softwareApplication) {
    return next(new ErrorHandler("Software Application not found", 404));
  }

  const softwareApplicationSVGId = softwareApplication.svg.public_id;

  await cloudinary.uploader.destroy(softwareApplicationSVGId);
  await softwareApplication.deleteOne();

  res.status(200).json({
    success: true,
    message: "Software Application has been deleted successfully!",
  });
});

// Controller to get all software applications
export const getAllSoftware = catchAsyncError(async (req, res, next) => {
  try {
    const softwareApplications = await Software.find();
    res.status(200).json({
      success: true,
      softwareApplications,
    });
  } catch (error) {
    next(error);
  }
});
