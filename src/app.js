import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.route.js" ;
import captainRouter from "./routes/captain.route.js"

app.use("/api/v1/user", userRouter);
app.use("/api/v1/captain", captainRouter);

export default app;