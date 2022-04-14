import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { isAuth } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';

const handler = nc({
  onError,
});

handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connectDB();

  const order = await Order.findById(req.query.id);
  console.log(order);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.payer.email_address,
    };

    const paidOrder = await order.save();
    await db.disconnectDB();

    res.send({ message: 'Order Paid', order: paidOrder });
  } else {
    await db.disconnectDB();

    res.status(404).send({ message: 'Order Not Found' });
  }

  res.send(order);
});

export default handler;
