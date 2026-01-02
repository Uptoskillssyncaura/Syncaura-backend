import jwt from 'jsonwebtoken';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;



export const generateAccessToken = (user) => {
  return jwt.sign(
    { role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES, subject: String(user._id) }
  );
};

export const generateRefreshToken = (user, refreshId) => {
  return jwt.sign(
    { rid: refreshId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES, subject: String(user._id) }
  );
};

export const assignRefreshId = (user) => {
  const rid = uuidv4();
  user.refreshTokenId = rid;
  return rid;
};
