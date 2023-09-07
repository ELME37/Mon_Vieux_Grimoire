const multer = require('multer');
const sharpMulter = require('sharp-multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

const newFilenameOption = (og_filename, options) => {
  return og_filename.split(".").slice(0, -1).join(".") + Date.now() + "." + options.fileFormat;
};

const storage =
  sharpMulter({
      destination: (req, file, callback) => callback(null, "images"),
      imageOptions: {
          fileFormat: "webp",
          quality: 80,
          resize: {width: 500, height: 700, resizeMode: 'cover'},
      },
      filename: newFilenameOption,
  });


const mimesTypesFilter = (req, file, callback) => {
  const isValid = !!MIME_TYPES[file.mimetype];
  const error = isValid ? null : new Error('Invalid mime type!');
  callback(error, isValid);
}

module.exports = multer({ storage, mimesTypesFilter }).single('image');
