const express = require('express');
const uploadController = require('../controllers/uploadController');
const router = express.Router();

let upload;

if (process.env.USE_CLOUDINARY === 'true') {
  // If using Cloudinary, expect the upload middleware from your Cloudinary service
  upload = require('../services/cloudinary').upload;
} else {
  // Local disk storage with Multer
  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../../uploads');
      // Ensure the upload directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
      cb(null, uniqueName);
    }
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed!'), false);
  };
  upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });
}

// Only Multer/Cloudinary middleware here, controller expects req.file!
router.post(
  '/',
  upload.single('file'),
  uploadController.uploadFile
);

module.exports = router;