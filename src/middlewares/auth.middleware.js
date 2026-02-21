module.exports = (req, res, next) => {
  // TEMP mock auth (later JWT)
  req.user = {
    id: "USER_001",
    role: "EMPLOYEE",
  };
  next();
};

