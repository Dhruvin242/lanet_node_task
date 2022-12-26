const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide name"],
  },
  email: {
    type: String,
    required: [true, "Please Provide email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide propper email id"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide Confirm password"],
    validate: {
      //this only work on .save() and .create()
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not same",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});


userSchema.methods.matchPassword = async function (bodypassword, userpassword) {
  return await bcrypt.compare(bodypassword, userpassword);
};

userSchema.methods.chanedPasswordAfter = function (tokenTime) {
  if (this.passwordChangedAt) {
    const convertpasswordChangedAt = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return tokenTime < convertpasswordChangedAt;
  }
  //false means not changed..
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
