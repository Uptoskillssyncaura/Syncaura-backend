// src/middlewares/roleCheck.js
const roleCheck = (req, res, next) => {
  const allowedRoles = ["admin", "coadmin"];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export default roleCheck;
