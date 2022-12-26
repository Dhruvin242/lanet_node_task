const BikeComments = require("../model/bikeCommentModel");
const APIFeture = require("../utils/apiFetures");
const catchAsync = require("../utils/catchAsync");
const errorResponse = require("../utils/errorResponse");

exports.createComment = catchAsync(async (req, res, next) => {
  const comment = await BikeComments.create({
    whoComment: req.user.id,
    commentMessage: req.body.commentMessage,
    whichBike: req.params.bikeId,
  });

  res.status(201).json({
    status: "success",
    data: {
      bike: comment,
    },
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await BikeComments.find();

  res.status(200).json({
    status: "success",
    data: comments,
  });
});
