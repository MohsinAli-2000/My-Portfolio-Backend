import mongoose, { Schema } from "mongoose";
const timelineSchema = new Schema({
  title: {
    type: String,
    required: [true, "TimeLine title is required"],
  },
  description: {
    type: String,
    required: [true, "TimeLine description is required"],
  },
  timeline: {
    from: {
      type: String,
      required: [true, "Starts time is required!"],
    },
    to: String,
  },
});

export const TimeLine = mongoose.model("Timeline", timelineSchema);
