import mongoose, { Schema } from "mongoose";

const skillSchema = new Schema({
  title: String,
  proficiency: String,
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

export const Skill = mongoose.model("Skill", skillSchema);
