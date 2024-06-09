import { TimeLine } from "../models/timelineSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/Error.js";

//controller to add timeline
export const addTimeline = catchAsyncError(async (req, res, next) => {
  const { title, description, from, to } = req.body;
  const myTimeline = await TimeLine.create({
    title,
    description,
    timeline: { from, to },
  });
  res.status(200).json({
    success: true,
    message: "Timeline added Successfully!",
    myTimeline,
  });
});

//controller to delete timeline
export const deleteTimeLine = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const timeline = await TimeLine.findById(id);
  if (!timeline) {
    return next(new ErrorHandler("Timeline Not found!", 404));
  }
  await timeline.deleteOne();
  res.status(200).json({
    success: true,
    message: "Timeline has been deleted successfully!",
  });
});

//controller to get timeline
export const getTimeLine = catchAsyncError(async (req, res, next) => {
  const timelines = await TimeLine.find();
  res.status(200).json({
    success: true,
    timelines,
  });
});
