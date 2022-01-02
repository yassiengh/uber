exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(400).json({ message: "user not logged in" });
  }
};

exports.restrictTo = (role) => {
  return (req, res, next) => {
    if (!(role == req.session.user[0].type)) {
      return res.status(400).json({ message: "not authorized" });
    }
    next();
  };
};
