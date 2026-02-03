import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder name
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    // unique file name (ex: 1697306123456.png)
  },
});

// File filter (optional – to allow only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Multer upload setup
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit 5MB
  fileFilter: fileFilter,
});

export default upload;
