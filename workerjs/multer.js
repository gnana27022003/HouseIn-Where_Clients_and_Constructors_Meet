const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'profile_image') {
            cb(null, 'uploads/profile_image/');
        }if (file.fieldname === 'previous_work') {
            cb(null, 'uploads/previous_work/');
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original name
    }
});

const upload = multer({ storage: storage });
module.exports = upload;
