const multer = require('multer');

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name as the saved file name
    }
});

const upload = multer({ storage: storage });

module.exports = upload;