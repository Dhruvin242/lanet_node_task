const express = require("express");
const bikeCommentContoller = require("../controller/bikeCommentController");
const { protect } = require("../controller/userAuthContoller");
const router = express.Router();

router.route("/:bikeId").post(protect, bikeCommentContoller.createComment);

router.route("/").get(bikeCommentContoller.getAllComments);

module.exports = router;
