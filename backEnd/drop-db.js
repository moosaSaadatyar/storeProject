require('./src/config/env');
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.dropDatabase();
    console.log('DB dropped:', mongoose.connection.name);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exitCode = 1;
  }
})();
