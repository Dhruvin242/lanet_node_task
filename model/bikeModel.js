const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    bikename: {
      type: String,
      unique: true,
      required: [true, "Please Provide bike name"],
    },
    bikeType: {
      type: mongoose.Schema.ObjectId,
      ref: "BikeType",
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide bike price"],
    },
    color: {
      type: String,
      required: [true, "Please provide bike color "],
    },
    fuelType: {
      type: String,
      required: [true, "Please provide fule Type "],
    },
    seatCapacity: {
      type: Number,
      required: [true, "Please provide seating capacity "],
    },
    whoCreated: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    like: {
      type: Number,
      default: 0,
    },
    Dislike: {
      type: Number,
      default: 0,
    },
    reaction:{
      type:String,
      default:null,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bikeSchema.pre("find", function (next) {
  this.find({ active: true });
  next();
});

bikeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "whoCreated",
    select: "name",
  }).populate({
    path: "bikeType",
    select: "bikeTypeName",
  });

  next();
});

bikeSchema.virtual("comments", {
  ref: "BikeComments",
  foreignField: "whichBike",
  localField: "_id",
});

const Bike = mongoose.model("Bike", bikeSchema);

module.exports = Bike;
