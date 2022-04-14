import nc from 'next-connect';
import bcrypt from 'bcryptjs';

import User from '../../../models/User';
import db from '../../../utils/db';
import { signToken, isAuth } from '../../../utils/auth';

const handler = nc();

handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connectDB();

  const { name, email, password } = req.body;

  const user = await User.findById(req.user._id);

  user.name = name;
  user.email = email;
  user.password = password ? bcrypt.hashSync(password) : user.password;

  await user.save();

  await db.disconnectDB();

  const token = signToken(user);

  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
