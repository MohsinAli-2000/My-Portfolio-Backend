import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/Error.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Certificate } from "../models/certificateSchema.js";

//controller to add certificate
export const addCertificate = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Certificate file is required!", 400));
  }
  const { title } = req.body;
  if (!title) {
    return next(new ErrorHandler("Title fields are required!", 400));
  }
  const certificateFilePath = Array.isArray(req.files.certificate)
    ? req.files.certificate[0].tempFilePath
    : req.files.certificate.tempFilePath;

  try {
    const certificateResponse = await uploadOnCloudinary(certificateFilePath);
    if (!certificateResponse) {
      return next(
        new ErrorHandler("Error while uploading file to clouidnary!")
      );
    }
    const certifcate = await Certificate.create({
      title,
      certificate: {
        public_id: certificateResponse.public_id,
        url: certificateResponse.secure_url,
      },
    });
    res.status(200).json({
      success: true,
      message: "Certificate has been added successfully!",
      certifcate,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//controller to delete certificate
export const deleteCertificate = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id);
  if (!certificate) {
    return next(new ErrorHandler("Certificate not found!"));
  }
  const cloudCertificate = certificate.certificate?.public_id;

  await cloudinary.uploader.destroy(cloudCertificate);
  await certificate.deleteOne();
  res.status(200).json({
    success: true,
    message: "Certificate has been deleted successfully!",
  });
});

//controller to get all certificate
export const getAllCertificate = catchAsyncError(async (req, res, next) => {
  const certificates = await Certificate.find();
  if (!certificates) {
    return next(new ErrorHandler("No certificate was found!", 404));
  }
  res.status(200).json({
    success: true,
    certificates,
  });
});

//controller to get singele certificate
export const getSingleCertificate = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id);
  if (!certificate) {
    return next(new ErrorHandler("Certificate not found!", 404));
  }
  res.status(200).json({
    success: true,
    certificate,
  });
});
