const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { initModels } = require('./src/models');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    initModels();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
