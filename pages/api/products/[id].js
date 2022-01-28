import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connectDB();

  const product = await Product.findById(req.query.id);

  await db.disconnectDB();

  res.send(product);
});

export default handler;
