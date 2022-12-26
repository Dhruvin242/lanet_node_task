const mongoose = require("mongoose");

const bikeTypeSchema = new mongoose.Schema({
  bikeTypeName: {
    type: String,
    required: [true, "Please Provide Bike type"],
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

bikeTypeSchema.pre('find', function (next) {
  this.find({ active: true });
  next();
});

const BikeType = mongoose.model("BikeType", bikeTypeSchema);
module.exports = BikeType;
