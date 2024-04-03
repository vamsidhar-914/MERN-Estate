const { createError } = require("../middleware/errorhandler");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(createError(400, "All fields are required"));
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const newUser = new User({ username, email, password: hash });
  try {
    await newUser.save();
    res.status(200).json({ message: "user created succesfully" });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(createError(400, "all fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser)
      return next(createError(404, "No user found with this emailId"));
    const match = await bcrypt.compare(password, validUser.password);
    if (!match) return next(createError(400, "invalid password"));
    const token = jwt.sign(
      {
        id: validUser._id,
        username: validUser.username,
      },
      process.env.SECRET
    );
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been logged out");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
};
