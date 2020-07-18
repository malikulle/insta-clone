const CustomError = require("../../helpers/error/CustomError");
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../../helpers/authorization/auth");
const jwt = require("jsonwebtoken");
const CustomerError = require("../../helpers/error/CustomError");
const getAccessToRoute = (req, res, next) => {
  const { JWT_SECRET_KEY } = process.env;
  if (!isTokenIncluded(req)) {
    return next(
      new CustomError("You are not authorize to access this Route", 401)
    );
  }
  const access_token = getAccessTokenFromHeader(req);

  jwt.verify(access_token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(
        new CustomError("You are not authorize to access this Route", 401)
      );
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };
    next();
  });
};

module.exports = {
  getAccessToRoute,
};
