const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const errorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  newUser.password = undefined;
  const token = generateToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new errorResponse("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password, user.password))) {
    return next(new errorResponse("Incorrect email or password", 401));
  }

  user.password = undefined;
  const token = generateToken(user._id);
  res.status(200).json({
    success: true,
    token,
    data: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //check token is avaliable or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new errorResponse("You are not logged in, Please Login first", 401)
    );
  }

  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check user is still exits or not
  const loginUser = await User.findById(payload.id);
  if (!loginUser) {
    return next(
      new errorResponse("User is no more exits with this token", 401)
    );
  }

  //GRANT ACCESS
  req.user = loginUser;
  next();
});
