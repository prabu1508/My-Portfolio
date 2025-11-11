const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

// ✅ Cloudinary config (must match your .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// ✅ Use memory storage (no /uploads folder, no fs)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload buffer stream directly to Cloudinary
const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });

module.exports = { upload, uploadToCloudinary };
