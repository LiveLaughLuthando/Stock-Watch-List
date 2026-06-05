const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log('MongoDB Connected');

  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

module.exports = connectDB;