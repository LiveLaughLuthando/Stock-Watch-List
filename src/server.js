const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

// Connect to MongoDB Atlas
connectDB();

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(` Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(` Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});