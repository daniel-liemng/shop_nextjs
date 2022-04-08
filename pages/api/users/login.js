import nc from 'next-connect';
import bcrypt from 'bcryptjs';

import User from '../../../models/User';
import db from '../../../utils/db';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {
  await db.connectDB();

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  await db.disconnectDB();

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = signToken(user);

    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).send({ message: 'Invalid Credentials' });
  }
});

export default handler;
