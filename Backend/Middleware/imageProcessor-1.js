const fs = require('fs');

const processImage = async (req, res, next) => {
    if (!req.file) return next();

    try {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        req.file.path = req.file.path.replace(/\\/g, '/');
        return next();
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Image processing failed: ' + err.message });
    }
};

module.exports = { processImage };
