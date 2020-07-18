const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/error/CustomError");

//Storage, FileFilter

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDirectory = path.dirname(require.main.filename);
    cb(null, path.join(rootDirectory + "/public/uploads"));
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];

    if (req.user) {
      req.savedImage =
        "image_" + req.user.id + "-" + Date.now() + "." + extension;
    } else {
      req.savedImage =
        "profile_image" +
        "-" +
        req.body.email +
        "-" +
        Date.now() +
        "." +
        extension;
    }
    cb(null, req.savedImage);
  },
});

const fileFilter = (req, file, cb) => {
  let allowedMimeType = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

  if (!allowedMimeType.includes(file.mimetype)) {
    return cb(new CustomError("Please Provide a valid image file", 400), false);
  }

  return cb(null, true);
};

const ImageUploud = multer({ storage, fileFilter });

module.exports = ImageUploud;
