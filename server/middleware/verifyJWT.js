const jwt = require("jsonwebtoken");
const { createError } = require("./errorhandler");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "Unauthorized,Token not found"));
  }
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return next(createError(401, "unauthorized,Token invalid"));
    }
    req.user = user;
    next();
  });
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return next(createError(403, "You are not allowed"));
    }
  });
};

module.exports = {
  verifyToken,
  verifyUser,
};
