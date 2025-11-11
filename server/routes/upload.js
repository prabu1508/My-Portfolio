import express from "express";
import { upload, uploadToCloudinary } from "../middleware/upload.js";

const router = express.Router();

const result = await uploadToCloudinary(req.file.buffer);
const imageUrl = result.secure_url; // ✅ correct


export default router;
