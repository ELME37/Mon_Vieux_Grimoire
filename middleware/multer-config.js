const multer = require ('multer');
const sharpMulter  =  require("sharp-multer");

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    "image/webp": "webp",
    "image/avif": "avif",
};

const storage = sharpMulter({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    },
    imageOptions: {
        fileFormat: "webp",
        quality: 80,
        resize: { width: 500, height: 500, resizeMode: "cover" },
    },
});

module.exports = multer({ storage }).single('image');
