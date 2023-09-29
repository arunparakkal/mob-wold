const path = require('path')
const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb) => { 
      cb(null, 'public/uploadProduct');
    },
    filename: (req, file, cb) => {
      console.log(Date.now());
      console.log(path.extname(file.originalname));
      cb(null, Date.now()+'.webp');
    },
}); 
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024, // Limit file size to 1MB (adjust as needed)
  },
  fileFilter: (req, file, callback) => {
    // Check file type, allow only images
    if (file.mimetype.startsWith('image/')) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type. Only images are allowed.'));
    }
  },
});

module.exports = upload