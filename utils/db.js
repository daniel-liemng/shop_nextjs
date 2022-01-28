import mongoose from 'mongoose';

const connection = {};

const connectDB = async () => {
  if (connection.isConnected) {
    console.log('MongoDB Already Connected!!!');
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;

    if (connection.isConnected === 1) {
      console.log('Use previous connection');
      return;
    }

    await mongoose.disconnect();
  }

  // Connect
  const db = await mongoose.connect(process.env.MONGO_URI);
  console.log('New Connection !!!');
  connection.isConnected = db.connections[0].readyState;
};

const disconnectDB = async () => {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('Not Connected');
    }
  }
};

const converDocToObj = (doc) => {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();

  return doc;
};

const db = { connectDB, disconnectDB, converDocToObj };

export default db;
