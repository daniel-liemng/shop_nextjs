import nc from 'next-connect';
import Product from '../../models/Product';
import db from '../../utils/db';
import { data } from '../../utils/data';

const handler = nc();

handler.get(async (req, res) => {
  await db.connectDB();

  await Product.deleteMany();
  await Product.insertMany(data.products);

  await db.disconnectDB();

  res.send({ message: 'Seeded Successfully' });
});

export default handler;
