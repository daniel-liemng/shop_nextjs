import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connectDB();

  const products = await Product.find();

  await db.disconnectDB();

  res.send(products);
});

export default handler;
