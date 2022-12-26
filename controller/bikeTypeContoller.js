const BikeType = require("../model/bikeTypeModel");
const APIFeture = require("../utils/apiFetures");
const catchAsync = require("../utils/catchAsync");
const errorResponse = require("../utils/errorResponse");

exports.creteBikeType = catchAsync(async (req, res, next) => {
  const biketype = await BikeType.create({
    bikeTypeName: req.body.bikeTypeName,
  });

  res.status(201).json({
    status: "success",
    data: {
      biketype,
    },
  });
});

exports.getAllBikeTypes = catchAsync(async (req, res, next) => {
  const bike_types = await BikeType.find();

  res.status(200).json({
    status: "success",
    result: bike_types.length,
    data: {
      bike_types,
    },
  });
});

exports.getSingleBikeType = catchAsync(async (req, res, next) => {
  const bike_types = await BikeType.findById('634d30ef04bc4d4750a3bd58');

  res.status(200).json({
    status: "success",
    result: bike_types.length,
    data: {
      bike_types,
    },
  });
});

exports.updateBikeType = catchAsync(async (req, res, next) => {
  const bike = await BikeType.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bike) {
    return next(new errorResponse(`This bike type id is not avaliable`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      bike,
    },
  });
});

exports.deleteBikeType = catchAsync(async (req, res, next) => {
  const bike = await BikeType.findById(req.params.id);
  if (!bike) {
    return next(new errorResponse(`This bike not avaliable`, 404));
  }

  bike.active = false;
  bike.save();

  res.status(200).json({
    status: "success",
    message: "Bike Type Deleted Successfully",
  });
});


