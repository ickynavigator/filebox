import mongoose from 'mongoose';

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  );
}

let cached = global.mongoose;

if (!cached) {
  // eslint-disable-next-line no-multi-assign
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGO_URL) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local',
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URL, opts).then(conn => conn);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default dbConnect;
