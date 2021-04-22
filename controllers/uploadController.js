const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: "itthisakd",
  api_key: "161784557926796",
  api_secret: "A_OyWIsFkAC_OeDer1w9dRYtEqg",
});

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.mimetype.split("/")[1]);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.split("/")[1] == "jpeg" ||
      file.mimetype.split("/")[1] == "png"
    )
      cb(null, true);
    else {
      cb(new Error("this file is not a photo"));
    }
  },
});

app.post("/", upload.single("image"), async (req, res, next) => {
  console.log(req.file);
  cloudinary.uploader.upload(req.file.path, async (err, result) => {
    if (err) return next(err);
    console.log(result);
    const product = await Product.create({
      name: req.body.name,
      imgUrl: result.secure_url,
    });
    console.log(product);
    fs.unlinkSync(req.file.path);
    res.status(200).json({ product });
  });
});
