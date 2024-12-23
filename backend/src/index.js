import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path"

dotenv.config();
const port = process.env.PORT || 3000;
const __dir = path.resolve()

app.use(express.json({ limit: '50mb' }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));




app.get("/", (req, res) => {
  res.send("Welcome To my Chat app Server side");
})
app.use("/api/auth",authRouter );
app.use("/api/messages",messageRouter );

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"../front-end/dist")))

  app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname,"../front-end","dist","index.html"))
  })
}



app.use((err, req, res, next) => {
  console.error(err.stack); // Logs error details
  console.log(err.message);
  
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});



server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();
});
