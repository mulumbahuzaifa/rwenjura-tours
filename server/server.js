import express from "express";
import products from "./data/products.js";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import postRouter from "./Routes/postsRoutes.js";
import multer from "multer";

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});
app.get("/", (req, res) => {
  res.send("API is running......");
});

// API
app.use("/api/import", ImportData);
app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
// app.get("/api/config/paypal", (req, res) => {
//   res.send(process.env.PAYPAL_CLIENT_ID);
// });

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;
app.listen(PORT, console.log("Server running....."));
