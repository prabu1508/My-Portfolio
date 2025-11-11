const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
// optional: sharp for image processing
let sharp;
try { sharp = require('sharp'); } catch (e) { sharp = null; }

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // create a secure random filename, preserve extension
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(12).toString('hex');
    cb(null, `${name}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and common document types (PDF, Word) for resume uploads
  const allowedImage = file.mimetype.startsWith('image/');
  const allowedDocs = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ].includes(file.mimetype);

  if (allowedImage || allowedDocs) {
    cb(null, true);
  } else {
    cb(new Error('Only image or document files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;

// Helper: generate thumbnail for uploaded image (async). Requires sharp.
module.exports.generateThumbnail = async (filepath, size = 200) => {
  if (!sharp) return null;
  try {
    const ext = path.extname(filepath);
    const dir = path.dirname(filepath);
    const base = path.basename(filepath, ext);
    const thumbName = `${base}-thumb${ext}`;
    const thumbPath = path.join(dir, thumbName);
    await sharp(filepath).resize(size, size, { fit: 'cover' }).toFile(thumbPath);
    return thumbPath;
  } catch (err) {
    console.error('Error generating thumbnail:', err.message);
    return null;
  }
};

module.exports.uploadsDir = uploadsDir;

