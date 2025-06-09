// This controller assumes Multer middleware is used in the router only.
// Do NOT configure or call Multer here.

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'fail',
      message: 'No file uploaded'
    });
  }
  res.status(201).json({
    status: 'success',
    data: {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    }
  });
};