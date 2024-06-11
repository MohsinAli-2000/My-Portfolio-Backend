import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./db/dbConnection.js";
import { errorMiddleware } from "./middlewares/Error.js";
import messageRouter from "./routes/message.route.js";
import userRouter from "./routes/user.route.js";
import timelineRouter from "./routes/timeline.route.js";
import softwareRouter from "./routes/software.route.js";
import skillRouter from "./routes/skill.route.js";
import projectRouter from "./routes/project.route.js";
import certificateRouter from "./routes/certificate.route.js";

// Configuring dotenv file
dotenv.config({
  path: "./config/config.env",
});

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  "https://mohsin-ali-portfolio-website.netlify.app",
  "https://mohsin-ali-portfolio-dashboard.netlify.app",
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS method
    credentials: true, // Ensure that credentials are allowed
  })
);

// Configuring cookie-parser middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuring file upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);

// Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/softwares", softwareRouter);
app.use("/api/v1/skills", skillRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/certificates", certificateRouter);

// Database connection
dbConnection();

// Error middleware
app.use(errorMiddleware);

export default app;
