import db from './db';

// For Frontend
export const getError = (err) =>
  err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;

// For backend
export const onError = async (err, req, res, next) => {
  await db.disconnectDB();
  res.status(500).send({ message: err.toString() });
};
