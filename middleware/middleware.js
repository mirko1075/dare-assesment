const createError = require('http-errors');

exports.isLoggedIn = (req, res, next) => {
  if (req.session.cookie) next();
  else next(createError(401));
};

