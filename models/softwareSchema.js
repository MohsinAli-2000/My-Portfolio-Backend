import mongoose, { Schema } from "mongoose";

const softwareSchema = new Schema({
  name: String,
  svg: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

export const Software = mongoose.model("Software", softwareSchema);
