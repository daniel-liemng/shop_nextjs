import jwt from 'jsonwebtoken';

export const signToken = (user) => {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};
