const mongoose = require('mongoose');

let memoryServer = null;

/**
 * اتصال به MongoDB.
 * اگر MONGO_URI تنظیم نشده باشد (محیط توسعه)، از MongoDB درون‌حافظه‌ای استفاده می‌کند.
 */
async function connectDB() {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri('cabinet-store');
    console.warn(`[db] MongoDB درون‌حافظه‌ای (توسعه) اجرا شد: ${uri}`);
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`[db] اتصال برقرار شد: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

module.exports = { connectDB, disconnectDB };
