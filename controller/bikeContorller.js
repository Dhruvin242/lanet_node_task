const Bike = require("../model/bikeModel");
const Like = require("../model/likesModel");
const BikeType = require("../model/bikeTypeModel");
const APIFeture = require("../utils/apiFetures");
const catchAsync = require("../utils/catchAsync");
const errorResponse = require("../utils/errorResponse");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.aliasRecentBike = (req, res, next) => {
  req.query.sort = "createdAt";
  req.query.limit = "1";
  req.query.fields = "-whoCreated -like";

  const fecture = new APIFeture(Bike, req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  next();
};

exports.TopLikeBike = (req, res, next) => {
  req.query.sort = "-like";
  // req.query.limit = "1";
  req.query.fields = "-whoCreated";

  const fecture = new APIFeture(Bike, req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  next();
};

const checkingBikeType = async (id) => {
  const bike = await BikeType.findById(id);
  return bike;
};

exports.createBike = catchAsync(async (req, res, next) => {
  const result = await checkingBikeType(req.body.bikeType);
  if (result.active === false)
    return next(
      new errorResponse("You can not create bike with this type", 400)
    );
  const newBike = await Bike.create({
    bikename: req.body.bikename,
    bikeType: req.body.bikeType,
    whoCreated: req.user.id,
    price: req.body.price,
    color: req.body.color,
    like: req.body.like,
    Dislike: req.body.Dislike,
    active: req.body.active,
    fuelType: req.body.fuelType,
    seatCapacity: req.body.seatCapacity,
  });

  res.status(201).json({
    status: "success",
    message: "New Bike Created..!",
  });
});

exports.getAllBikes = catchAsync(async (req, res, next) => {
  //Excute query

  const match = {};
  keywords = Object.keys(req.query);
  if (keywords.length > 0) {
    keywords.forEach((el) => {
      return (match[el] = new RegExp(req.query[el]));
    });
  }

  let { page, limit, sort } = req.query;
  if (!limit) limit = 3;
  if (!page) page = 1;
  const skip = (page - 1) * limit;

  const bikes = await Bike.find(match).skip(skip).limit(limit).sort(sort);

  res.status(200).json({
    success: true,
    result: bikes.length,
    data: {
      bikes,
    },
  });
});

exports.getBike = catchAsync(async (req, res, next) => {
  const bike = await Bike.findById(req.params.bikeId).populate("comments", {
    commentMessage: 1,
  });
  if (!bike) {
    return next(
      new errorResponse(`Bike not found with this id ${req.params.bikeId}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      bike,
    },
  });
});

exports.updateBike = catchAsync(async (req, res, next) => {
  const filterBody = filterObj(
    req.body,
    "bikename",
    "bikeType",
    "like",
    "active"
  );
  const updateBike = await Bike.findByIdAndUpdate(
    req.params.bikeId,
    filterBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      bike: updateBike,
    },
  });
});

exports.deleteBike = catchAsync(async (req, res, next) => {
  const bike = await Bike.findById(req.params.bikeId);
  if (!bike) {
    return next(
      new errorResponse(`Bike with this id ${req.params.bikeId} not found`, 404)
    );
  }

  bike.active = false;
  bike.save();

  res.status(200).json({
    status: "success",
    message: "Bike Deleted Successfully..!",
  });
});

exports.setlike = catchAsync(async (req, res, next) => {
  const bike = await Bike.findById(req.body.bikeId);
  const Likecheck = await Like.findOne({
    bikeId: req.body.bikeId,
    userId: req.user.id,
  });

  if (!bike) {
    return next(
      new errorResponse(`Bike with this id ${req.body.bikeId} not found`, 404)
    );
  }

  if (Likecheck === null) {
    await Like.create({
      userId: req.user.id,
      bikeId: req.body.bikeId,
      reaction: "like",
    });

    bike.like++;
    bike.save();
  }

  if (Likecheck !== null) {
    if (Likecheck.reaction === "like") {
      return next(new errorResponse("You already likes this bike", 400));
    }
    if (Likecheck.reaction === "dislike") {
      Likecheck.reaction = "like";
      Likecheck.save();
      bike.like++;
      bike.Dislike--;
      bike.save();
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      bike,
    },
  });
});

exports.setdislike = catchAsync(async (req, res, next) => {
  const bike = await Bike.findById(req.body.bikeId);
  const Likecheck = await Like.findOne({
    bikeId: req.body.bikeId,
    userId: req.user.id,
  });

  if (!bike) {
    return next(
      new errorResponse(`Bike with this id ${req.body.bikeId} not found`, 404)
    );
  }

  if (Likecheck === null) {
    await Like.create({
      userId: req.user.id,
      bikeId: req.body.bikeId,
      reaction: "dislike",
    });

    bike.Dislike++;
    bike.save();
  }

  if (Likecheck !== null) {
    if (Likecheck.reaction === "dislike") {
      return next(new errorResponse("You already dislike this bike", 400));
    }
    if (Likecheck.reaction === "like") {
      Likecheck.reaction = "dislike";
      Likecheck.save();
      bike.like--;
      bike.Dislike++;
      bike.save();
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      bike,
    },
  });
});

exports.getBikeByType = catchAsync(async (req, res, next) => {
  const bike = await Bike.find();
  const result = [];
  bike.filter((el) => {
    if (el.bikeType.bikeTypeName === Object.values(req.query)[0])
      result.push(el);
  });

  if (result.length === 0)
    next(new errorResponse("There is no bike avaliable with this type", 404));

  res.status(200).json({
    status: "success",
    results: result.length,
    data: {
      bikes: result,
    },
  });
});

exports.userCreatedBike = catchAsync(async (req, res, next) => {
  const bike = await Bike.find();
  const result = [];

  bike.filter((el) => {
    const obj = el.whoCreated;
    const myjson = JSON.stringify(obj);

    if (myjson.substring(8, 32) === req.user.id) result.push(el);
  });

  if (result.length === 0)
    return next(
      new errorResponse(`No Bike avaliable with this id ${req.user.id}`, 404)
    );
  res.status(200).json({
    status: "success",
    results: result.length,
    data: {
      result,
    },
  });
});

exports.advanseSearch = catchAsync(async (req, res, next) => {
  const match = {};
  keywords = Object.keys(req.query);
  if (keywords.length > 0) {
    keywords.forEach((el) => {
      return (match[el] = new RegExp(req.query[el], "i"));
    });
  }
  const response = await Bike.aggregate([
    {
      $match: match,
    },
  ]);

  res.status(200).json({
    status: "success",
    results: response.length,
    data: {
      response,
    },
  });
});

exports.getTotalLikes = catchAsync(async (req, res, next) => {
  const bike = await Bike.findById(req.params.bikeId);
  if (!bike)
    return next(
      new errorResponse(`bike not found with this id ${req.params.bikeId}`, 404)
    );

  const totalLikes = bike.like;
  const totalDisLikes = bike.Dislike;

  res.status(200).json({
    status: "success",
    totalLikes,
    totalDisLikes,
  });
});
