/**
 * Cloudinary service for handling file uploads
 * Supports image and video uploads for the Netflix clone application
 */

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Configure multer storage for Cloudinary
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder and resource type based on file type
    let folder = 'netflix-clone/misc';
    let resourceType = 'auto';
    
    if (file.mimetype.startsWith('image/')) {
      folder = 'netflix-clone/images';
      resourceType = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'netflix-clone/videos';
      resourceType = 'video';
    }
    
    return {
      folder: folder,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
      transformation: file.mimetype.startsWith('image/') ? [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto' }
      ] : undefined
    };
  },
});

/**
 * Multer upload configuration
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
  }
});

/**
 * Delete file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @param {string} resourceType - Type of resource (image, video, raw)
 * @returns {Promise<Object>}
 */
async function deleteFile(publicId, resourceType = 'image') {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
}

/**
 * Get optimized URL for image/video
 * @param {string} publicId - The public ID of the file
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized URL
 */
function getOptimizedUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...options
  });
}

module.exports = {
  cloudinary,
  upload,
  deleteFile,
  getOptimizedUrl
};