import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
  title: String,
  description: String,
  githubRepoLink: String,
  projectLink: String,
  technologies: String,
  stack: String,
  deployed: String,
  projectThumbnail: {
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

export const Project = mongoose.model("Project", projectSchema);
