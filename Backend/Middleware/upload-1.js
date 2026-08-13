const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = 'uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname) || '.jpg';
        const uniqueName = `license-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});

function checkFileType(file, cb) {
    const isImage = file.mimetype.startsWith('image/');

    if (isImage) {
        return cb(null, true);
    }

    cb(new Error('Only image files are allowed!'));
}

const upload = multer({
    storage,
    limits: { fileSize: 5000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
