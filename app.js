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
//configuring dotenv file
dotenv.config({
  path: "./config/config.env",
});
const app = express();

//configuring cross origin sharing
app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

//configuring cookie-parser middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//configuring fileupload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);

//message router
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/softwares", softwareRouter);
app.use("/api/v1/skills", skillRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/certificates", certificateRouter);
dbConnection();
app.use(errorMiddleware);
export default app;
