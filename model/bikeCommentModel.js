const mongoose = require("mongoose");

const bikeCommentSchema = new mongoose.Schema(
  {
    whoComment: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    commentMessage: {
      type: String,
      required: [true, "Please Provide comment message"],
    },
    whichBike: {
      type: mongoose.Schema.ObjectId,
      ref: "Bike",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// bikeCommentSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "whoComment",
//     select: "name",
//   }).populate({
//     path: "whichBike",
//     select: "bikename bikeType",
//   });
//   next();
// });

const BikeComments = mongoose.model("BikeComments", bikeCommentSchema);

module.exports = BikeComments;
