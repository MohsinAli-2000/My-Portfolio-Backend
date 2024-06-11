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

// Configuring cross origin sharing
const allowedOrigins = [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware to set headers for every response
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

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
