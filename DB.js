const mongoose = require('mongoose');
require('dotenv').config();
//const mongoURL='mongodb://localhost:27017/voting'
const mongoURL=process.env.DB_URL;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 
})
.then(() => {
  console.log('✅ Initial connection successful');
})
.catch((err) => {
  console.error('❌ Initial connection error:', err.message);
});


const db = mongoose.connection;

db.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

db.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

db.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

module.exports=db;