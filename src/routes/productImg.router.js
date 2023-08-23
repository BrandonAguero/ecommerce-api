const {
  getAll,
  create,
  remove,
} = require("../controllers/productImg.controller");
const express = require("express");
const upload = require("../utils/multer.js");

const routerProductImg = express.Router();

routerProductImg.route("/").get(getAll).post(upload.single("image"), create);

routerProductImg.route("/:id").delete(remove);

routerProductImg.route("/:id/images").delete(remove);

module.exports = routerProductImg;
