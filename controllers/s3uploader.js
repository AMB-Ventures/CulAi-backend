const { S3Client } = require("@aws-sdk/client-s3"); // AWS SDK v3
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Configure AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID, 
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

// Multer S3 Storage Configuration
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME.replace(/['"]/g, ""),
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `uploads/${uuidv4()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 500 * 1024 },
});

// Middleware for single & multiple file uploads
const uploadSingle = upload.single("image");
const uploadMultiple = upload.array("images", 5);

module.exports = { uploadSingle, uploadMultiple };
