import mongoose, { Schema } from "mongoose";

const certificateSchema = new Schema({
  title: String,
  certificate: {
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

export const Certificate = mongoose.model("Certificate", certificateSchema);
